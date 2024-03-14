const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tags' });
  }
});

// GET one tag by its `id` with associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tagData) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tag' });
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedTag[0] === 0) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// Delete one tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!deletedTag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

module.exports = router;
