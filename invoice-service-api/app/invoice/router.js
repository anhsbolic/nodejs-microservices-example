const express = require('express');
const invoiceController = require('./controller');

const router = express.Router();

router.get('/', invoiceController.index);
router.post('/', invoiceController.create);

router.get('/:id', invoiceController.detail);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.deleteOne);

router.post('/:id/approve', invoiceController.approveInvoice);

module.exports = router;
