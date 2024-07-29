const Section = require('../models/postgres_models/Menu');

class SectionService {
    static async getSections() {
        return Section.findAll();
    }

    static async createSection(sectionData) {
        try {
            const newSection = await Section.create(sectionData);
            return newSection;
        } catch (error) {
            throw error;
        }
    }

    static async updateSection(id, updates) {
        try {
            const [updatedRowsCount, updatedSections] = await Section.update(updates, {
                where: { id },
                returning: true,
            });
            return updatedSections[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteSection(id) {
        try {
            const deletedRowCount = await Section.destroy({
                where: { id },
            });
            return deletedRowCount > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SectionService;
