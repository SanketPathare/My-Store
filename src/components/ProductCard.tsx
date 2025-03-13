import Link from "next/link";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-52 object-scale-down"
        />
        <div className="p-4">
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-md">${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
