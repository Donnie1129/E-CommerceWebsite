const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productsData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// GET one product by id with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ],
    });

    if (!productData) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: newProduct.id,
        tag_id
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedProduct[0] === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map(tag_id => ({
        product_id: req.params.id,
        tag_id
      }));

      await ProductTag.destroy({ where: { product_id: req.params.id } });
      await ProductTag.bulkCreate(productTags);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
