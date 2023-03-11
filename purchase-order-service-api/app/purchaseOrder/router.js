const express = require('express');
const purchaseOrderController = require('./controller');

const router = express.Router();

router.get('/', purchaseOrderController.index);
router.post('/', purchaseOrderController.create);

router.get('/:id', purchaseOrderController.detail);
router.put('/:id', purchaseOrderController.update);
router.delete('/:id', purchaseOrderController.deleteOne);

router.post('/:id/status', purchaseOrderController.updateStatus);

module.exports = router;
