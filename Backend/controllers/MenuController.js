const SectionService = require('../services/MenuService');

const getSections = async (req, res) => {
    try {
        const sections = await SectionService.getSections();
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSection = async (req, res) => {
    try {
        const newSection = await SectionService.createSection(req.body);
        res.json(newSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSection = async (req, res) => {
    try {
        const updatedSection = await SectionService.updateSection(req.params.id, req.body);
        res.json(updatedSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSection = async (req, res) => {
    try {
        const success = await SectionService.deleteSection(req.params.id);
        res.json({ success: !!success });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSections,
    createSection,
    updateSection,
    deleteSection,
};
