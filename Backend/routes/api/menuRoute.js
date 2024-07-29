const express = require('express');
const router = express.Router();
const SectionController = require('../../controllers/MenuController');

router.get('/', SectionController.getSections);
router.post('/', SectionController.createSection);
router.put('/:id', SectionController.updateSection);
router.delete('/:id', SectionController.deleteSection);

module.exports = router;
