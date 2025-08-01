        const mongoose = require('mongoose');

        const subcategorySchema = mongoose.Schema(
            {
                name: {
                    type: String,
                    required: [true, 'Please add a subcategory name'],
                    unique: true,
                },
                category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category',
                    required: [true, 'Please select a parent category'],
                },
                description: {
                    type: String,
                    required: false,
                },
            },
            {
                timestamps: true,
            }
        );

        module.exports = mongoose.model('Subcategory', subcategorySchema);
        