#!/bin/bash

echo "Checking if server is up..."
curl -s http://localhost:3001/api/docs > /dev/null
if [ $? -eq 0 ]; then
    echo "Server is up."
else
    echo "Server is not reachable yet. Waiting..."
    sleep 5
fi

# We need a category first because we reset the DB
echo "Creating a category first..."
curl -X POST http://localhost:3001/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Abaya",
    "description": "Premium Abayas",
    "slug": "abaya-v2",
    "icon": "👘"
}'
echo ""

echo "Attempting to create product (Schema v2)..."
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product V2",
    "price": 100,
    "sku": "TP-V2-001",
    "slug": "test-product-v2",
    "description": "A test product for Schema V2",
    "categoryName": "Abaya",
    "localizedNames": {"en": "Test Product V2", "bn": "Test Product V2 BN"},
    "localizedDescriptions": {"en": "Desc EN", "bn": "Desc BN"},
    "discount": {"type": "flat", "value": 10},
    "images": [
        {"url": "http://example.com/global.jpg", "isPrimary": true}
    ],
    "variants": [
        {
            "colorName": "Black",
            "colorCode": "#000000",
            "images": ["http://example.com/black.jpg"],
            "sizes": [
                {
                    "size": "M",
                    "stock": "10",
                    "sku": "TP-V2-BLK-M",
                    "price": "100"
                }
            ]
        }
    ],
    "badges": ["New Arrival"]
}' -v
