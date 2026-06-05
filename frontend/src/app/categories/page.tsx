import { categoryService } from '@/services/marketplace.service';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | Kadal2Kadaai',
  description: 'Browse fresh seafood categories - Fish, Prawns, Crabs, and more.',
};

export default async function CategoriesPage() {
  const categories = await categoryService.getAll().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Seafood Categories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of fresh seafood, sourced directly from local fishermen.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">No categories available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
