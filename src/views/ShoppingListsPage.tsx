"use client";

import React from 'react';
import ShoppingLists from '@/components/ShoppingLists';
import SEOHead from '@/components/SEOHead';

const ShoppingListsPage = () => {
  return (
    <>
      <SEOHead
        title="Shopping Lists | EaterIQ"
        description="Create and manage your shopping lists with EaterIQ. Add products from your scans and organize your grocery shopping."
        canonicalUrl="https://www.eateriq.com/shopping-lists/"
      />
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 rounded-[32px] border border-white/60 bg-white/82 px-6 py-10 text-center shadow-product backdrop-blur-sm">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              Shopping Lists
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
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
