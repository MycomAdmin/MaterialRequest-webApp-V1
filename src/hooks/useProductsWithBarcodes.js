import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBarcodes, fetchProducts, selectBarcodes, selectMasterDataLoading, selectProducts } from "../redux/slices/masterDataSlice";

export default function useProductsWithBarcodes(openTrigger = true) {
    const dispatch = useDispatch();

    const products = useSelector(selectProducts);
    const barcodes = useSelector(selectBarcodes);
    const { products: productsLoading, barcodes: barcodesLoading } = useSelector(selectMasterDataLoading);

    const loading = productsLoading || barcodesLoading;

    // Fetch once or whenever the "openTrigger" changes
    useEffect(() => {
        if (openTrigger) {
            dispatch(fetchProducts());
            dispatch(fetchBarcodes());
        }
    }, [openTrigger, dispatch]);

    // Merge products + barcodes (same logic as InsightModal)
    const mergedItems = useMemo(() => {
        if (!products || !barcodes) return [];

        return products.flatMap((product) => {
            const related = barcodes.filter(
                (b) => b.product_id?.trim() === product.product_id?.trim() || b.product_id?.trim() === product.master_product_id?.trim() || b.product_code?.trim() === product.product_code?.trim()
            );

            // No barcode → normal product
            if (related.length === 0)
                return [
                    {
                        ...product,
                        isBarcodeItem: false,
                        uniqueId: `product-${product.product_id}`,
                        item_desc: product.product_des,
                        item_code: product.product_code,
                        price: product.price1,
                        uom: product.uom_code,
                        stock: product.item_qty,
                        category: product.product_category || product.item_type,
                    },
                ];

            // Create rows for each valid barcode
            return related
                .filter((br) => br.valid === "Y")
                .map((barcode) => ({
                    ...product,
                    item_desc: barcode.barcode_description || product.product_des,
                    item_code: barcode.product_code,
                    price: product.price1,
                    uom: barcode.uom_code,
                    category: product.product_category || product.item_type,
                    stock: product.item_qty,

                    // Barcode metadata
                    isBarcodeItem: true,
                    barcode_type: barcode.barcode_type,
                    barcode_description: barcode.barcode_description,
                    is_default: barcode.is_default,
                    is_supplier_barcode: barcode.is_supplier_barcode,
                    valid: barcode.valid,
                    barcode_data: barcode,
                    uniqueId: `barcode-${barcode.product_code}-${product.product_id}`,
                }));
        });
    }, [products, barcodes]);

    // search product by ANY barcode
    const findByBarcode = (barcode) => {
        if (!barcode) return null;

        const list = mergedItems;

        return (
            list.find((item) => item.item_code?.trim() === barcode.trim()) ||
            list.find((item) => item.product_code?.trim() === barcode.trim()) ||
            list.find((item) => item.barcode_data?.product_code?.trim() === barcode.trim()) ||
            null
        );
    };

    return {
        productsWithBarcodes: mergedItems,
        loading,
        findByBarcode, // <— used for SCAN
    };
}
