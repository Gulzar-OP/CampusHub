import MarketplaceHero from "../components/marketplace/MarketplaceHero";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilter";
import ProductGrid from "../components/marketplace/ProductGrid";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <MarketplaceHero />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Filters */}
        <div className="lg:col-span-1">
          <MarketplaceFilters />
        </div>

        {/* Product Feed */}
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>

      </div>
    </div>
  );
};

export default Marketplace;