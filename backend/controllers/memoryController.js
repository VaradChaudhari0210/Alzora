const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.processMemoryUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, title, description } = req.body;
    const file = req.file;
    console.log(req.file);  

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save to MemoryUpload table
    const memory = await prisma.memoryUpload.create({
      data: {
        userId: userId,
        type: type,
        title: title,
        description: description,
        filePath: file.path,
        tags: [],
        status: 'pending',
      }
    });

    res.status(201).json({ message: 'Memory uploaded successfully', memory });
  } catch (error) {
    console.error('Error uploading memory:', error);
    res.status(500).json({ message: 'Error uploading memory', error });
  }
};