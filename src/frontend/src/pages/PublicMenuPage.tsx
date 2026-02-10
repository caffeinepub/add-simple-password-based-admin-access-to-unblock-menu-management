import { useState, useMemo } from 'react';
import { useGetCategories, useGetAllFoodItems } from '../hooks/useQueries';
import PublicLayout from '../components/layout/PublicLayout';
import MenuItemCard from '../components/menu/MenuItemCard';
import CategoryFilter from '../components/menu/CategoryFilter';
import MenuSearchBar from '../components/menu/MenuSearchBar';
import ShareMenu from '../components/menu/ShareMenu';
import PublicActionsSection from '../components/menu/PublicActionsSection';
import { RequestState, CardSkeleton } from '../components/state/RequestState';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Settings } from 'lucide-react';

export default function PublicMenuPage() {
  usePageMeta('Our Menu - Digital Restaurant Menu', 'Browse our delicious menu items');
  
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategories();
  const { data: allItems = [], isLoading: itemsLoading, error: itemsError } = useGetAllFoodItems();

  const filteredItems = useMemo(() => {
    let items = allItems.filter((item) => item.enabled);

    if (selectedCategory) {
      items = items.filter((item) => item.categoryId === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    return items;
  }, [allItems, selectedCategory, searchTerm]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, typeof filteredItems>();
    
    filteredItems.forEach((item) => {
      if (!groups.has(item.categoryId)) {
        groups.set(item.categoryId, []);
      }
      groups.get(item.categoryId)!.push(item);
    });

    return groups;
  }, [filteredItems]);

  const isLoading = categoriesLoading || itemsLoading;
  const error = categoriesError || itemsError;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/menu-hero-bg.dim_1600x900.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/cafe-logo.dim_512x512.png"
                alt="Restaurant Logo"
                className="h-12 w-12 md:h-16 md:w-16 rounded-full shadow-soft"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Our Menu</h1>
                <p className="text-muted-foreground mt-1">Delicious food, made with love</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ShareMenu />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="space-y-4 mb-8">
          <MenuSearchBar value={searchTerm} onChange={setSearchTerm} />
          <RequestState
            isLoading={categoriesLoading}
            error={categoriesError}
            isEmpty={categories.length === 0}
            emptyMessage="No categories available"
          >
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </RequestState>
        </div>

        {/* Menu Items */}
        <RequestState
          isLoading={isLoading}
          error={error}
          isEmpty={filteredItems.length === 0}
          emptyMessage={searchTerm ? 'No items match your search' : 'No menu items available'}
          loadingComponent={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          {selectedCategory === null && !searchTerm ? (
            // Show by category sections
            <div className="space-y-12">
              {categories
                .filter((cat) => cat.enabled && groupedItems.has(cat.id))
                .map((category) => (
                  <section key={category.id}>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedItems.get(category.id)?.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          ) : (
            // Show filtered results
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </RequestState>

        {/* Actions Section */}
        <PublicActionsSection />
      </main>
    </PublicLayout>
  );
}
