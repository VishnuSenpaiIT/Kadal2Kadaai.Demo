import Link from 'next/link';
import { Category } from '@/types/marketplace.types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm hover:border-primary hover:shadow-md transition-all duration-200 group text-center"
    >
      <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary text-3xl mb-4 group-hover:scale-110 transition-transform">
        {category.icon || '🐟'}
      </div>
      <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      {category.products_count !== undefined && (
        <p className="text-sm text-muted-foreground">
          {category.products_count} Products
        </p>
      )}
    </Link>
  );
}
