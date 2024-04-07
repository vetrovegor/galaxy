import { create } from 'zustand';

const initialValue = {
    products: [],
    productsQuantity: 0,
    totalSum: 0
};

const useBasketStore = create((set) => ({
    basket: initialValue,
    init: (data) => set({ basket: data }),
    clear: () => set({ basket: initialValue }),
    addProduct: (product, quantity) => {
        set((state) => {
            const updatedProducts = [...state.basket.products];
            const existingProductIndex = updatedProducts.findIndex(
                (p) => p._id === product._id
            );

            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].quantity += quantity;
                updatedProducts[existingProductIndex].sum =
                    updatedProducts[existingProductIndex].quantity *
                    updatedProducts[existingProductIndex].price; // Вычисляем сумму для обновленного товара
            } else {
                const sum = quantity * product.price; // Вычисляем сумму для нового товара
                updatedProducts.push({ ...product, quantity, sum }); // Добавляем новое поле sum
            }

            const updatedQuantity = state.basket.productsQuantity + quantity;
            const updatedTotalSum =
                state.basket.totalSum + product.price * quantity;

            return {
                basket: {
                    ...state.basket,
                    products: updatedProducts,
                    productsQuantity: updatedQuantity,
                    totalSum: updatedTotalSum
                }
            };
        });
    },
    removeProduct: (productId) => {
        set((state) => {
            const updatedProducts = state.basket.products.filter(
                (product) => product._id !== productId
            );
            const updatedQuantity = updatedProducts.reduce(
                (total, product) => total + product.quantity,
                0
            );
            const updatedTotalSum = updatedProducts.reduce(
                (total, product) => total + product.price * product.quantity,
                0
            );

            return {
                basket: {
                    ...state.basket,
                    products: updatedProducts,
                    productsQuantity: updatedQuantity,
                    totalSum: updatedTotalSum
                }
            };
        });
    }
}));

export default useBasketStore;
