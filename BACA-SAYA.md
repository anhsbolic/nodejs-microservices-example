# cb-node-microservice-rabbitmq

## Tentang Aplikasi

Terdiri dari 4 service

- product service
- purchase order service
- billing order service
- invoice order service

Setiap service memiliki endpoint minimal untuk melakukan CRUD data

## Prove of Concept

Selain kemampuan api dalam segi CRUD, aplikasi ini perlu diuji dari sisi penggunaan rabbitmq sebagai message broker.

Untuk menunjukannya, dibuatlah fitur auto create invoice saat membuat billing yang baru.

Ketika billing baru dibuat, jika flag auto_create_invoice adalah true, maka pesan akan dipublish oleh publisher ke message broker (rabbitmq). Dan consumer di invoice service akan menerima pesan tersebut, kemudian melakukan pembuatan invoice baru atas billing tersebut.

## Reproduce Steps

1. Create New Product
2. Create New Purchase Order
3. Create New Billing with flag auto_create_invoice = true
4. See New Invoice on Invoice List
