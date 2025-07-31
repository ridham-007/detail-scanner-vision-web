import React from 'react';
import ShoppingLists from '@/components/ShoppingLists';
import SEOHead from '@/components/SEOHead';

const ShoppingListsPage = () => {
  return (
    <>
      <SEOHead
        title="Shopping Lists | EaterIQ"
        description="Create and manage your shopping lists with EaterIQ. Add products from your scans and organize your grocery shopping."
      />
      
      <div className="min-h-screen dark:bg-[#1E2836]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent mb-4">
              Shopping Lists
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create and manage your shopping lists. Add products from your scans and keep track of your grocery shopping.
            </p>
          </div>
          
          <ShoppingLists />
        </div>
      </div>
    </>
  );
};

export default ShoppingListsPage;