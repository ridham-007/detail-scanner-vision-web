import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { ProductData } from '@/types/ProductData';
import { useProductLookup } from '@/hooks/useProductLookup';
import { useScanHistory } from '@/hooks/useScanHistory';
import BarcodeScanner from '@/components/BarcodeScanner';
import { toast } from 'sonner';

interface ProductSelectionModalProps {
    isOpen: boolean;
    slot: 'A' | 'B' | null;
    onClose: () => void;
    onSelect: (product: ProductData) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({ isOpen, slot, onClose, onSelect }) => {
    const [activeTab, setActiveTab] = useState("product"); // Default to Product (History)
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ProductData[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const { scanHistory, isLoading: isHistoryLoading, fetchScanHistory } = useScanHistory();
    const { lookupProduct, searchProductsByName, isLoading } = useProductLookup();

    // Fetch history when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchScanHistory();
            setSearchQuery("");
            setSearchResults([]);
            setActiveTab("product");
            setIsScanning(false);
        }
    }, [isOpen]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        const trimmedQuery = searchQuery.trim();

        // Heuristic: If it looks like a barcode (all numbers, >6 chars), use lookup
        const isBarcode = /^\d{6,}$/.test(trimmedQuery);

        if (isBarcode) {
            const product = await lookupProduct(trimmedQuery);
            if (product) {
                onSelect(product);
            } else {
                toast.error("Product not found");
            }
        } else {
            const results = await searchProductsByName(trimmedQuery);
            setSearchResults(results);
            if (results.length === 0) {
                toast.error("No products found");
            }
        }
    };

    const handleScan = async (barcode: string) => {
        setIsScanning(false);
        const product = await lookupProduct(barcode);
        if (product) {
            onSelect(product);
        } else {
            toast.error("Product not found");
        }
    };

    const getHealthScoreColor = (score: number | null) => {
        if (!score) return "bg-gray-200 text-gray-700";
        if (score >= 80) return "bg-green-100 text-green-700";
        if (score >= 60) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md max-h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Select Product {slot}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="product">Product</TabsTrigger>
                            <TabsTrigger value="scan">Scanner</TabsTrigger>
                        </TabsList>

                        {/* Tab 1: Product (History + Search Results) */}
                        <TabsContent value="product" className="mt-4 flex-1 flex flex-col overflow-hidden space-y-4">
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Product name or barcode..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch} disabled={isLoading}>
                                    {isLoading ? '...' : 'Search'}
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {/* Show Search Results if they exist, otherwise show History */}
                                {searchResults.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-2 border-b">
                                            <h4 className="font-semibold text-sm">Search Results</h4>
                                            <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={() => setSearchResults([])}>Clear</Button>
                                        </div>
                                        {searchResults.map((product) => (
                                            <div
                                                key={product.barcode}
                                                className="flex items-center p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                                                onClick={() => onSelect(product)}
                                            >
                                                {product.images?.[0] && (
                                                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-contain mr-3 bg-white rounded" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{product.barcode}</p>
                                                </div>
                                                <div className={`text-xs font-bold px-2 py-1 rounded ${getHealthScoreColor(product.health_score)}`}>
                                                    {product.health_score}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full overflow-y-auto pr-2 space-y-2">
                                        <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Recent Scans</h4>
                                        {isHistoryLoading ? (
                                            <div className="text-center py-8 text-muted-foreground">Loading history...</div>
                                        ) : scanHistory.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No previously scanned products.
                                            </div>
                                        ) : (
                                            scanHistory.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                                                    onClick={() => handleScan(item.barcode)}
                                                >
                                                    <div className="flex-1 min-w-0 mr-2">
                                                        <h4 className="font-medium text-sm truncate">{item.product_name}</h4>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {new Date(item.scanned_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className={`text-xs font-bold px-2 py-1 rounded ${getHealthScoreColor(item.health_score)}`}>
                                                        {item.health_score ?? '-'}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Tab 2: Scanner (Camera + Manual Entry) */}
                        <TabsContent value="scan" className="mt-4 space-y-4">
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Product name or barcode..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch} disabled={isLoading}>
                                    {isLoading ? '...' : 'Search'}
                                </Button>
                            </div>
                            <div className="border-t pt-4">
                                <BarcodeScanner
                                    isScanning={isScanning}
                                    onToggleScanning={() => setIsScanning(!isScanning)}
                                    onScan={handleScan}
                                />
                                <div className="text-center text-xs text-muted-foreground mt-2">
                                    Point camera at a barcode to scan automatically
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductSelectionModal;
