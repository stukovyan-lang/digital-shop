import { getProduct, products } from '@/data/products';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Товар';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return renderOg({ title: p?.name ?? 'Товар', subtitle: p?.description });
}
