import prisma from "../config/prisma.js";
import { createError } from "../utils/createError.js";
import cloudinary from "../config/cloudinaryconfig.js";
import fs from "fs/promises";
export const createPost = async (req, res, next) => {
  const imageUrls = req.files?.map((file) => file.path);

  try {
    const { landtype, area, location, price, lat, lng } = req.body;
    // Assume req.files is an array of files from multer
    let images;

    // 1. Create the LandDetails record first
    const createdPost = await prisma.landDetails.create({
      data: {
        landtype,
        area: parseFloat(area),
        location,
        price: parseFloat(price),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        User: { connect: { id: req.user.id } },

        // if you have userId from auth, add it here
        // userId: req.user.id,
      },
    });

    // 2. Create Image records linked to the LandDetails record
    if (imageUrls.length > 0) {
      const uploadResult = await Promise.all(
        imageUrls.map((path) => cloudinary.uploader.upload(path))
      );

      const imagesData = uploadResult.map((url) => ({
        image_url: url.secure_url,
        landDetailsId: createdPost.id,
      }));
      images = imagesData;
      await prisma.image.createMany({
        data: imagesData,
      });
    }

    res.status(200).json({
      message: "Create successfully",
      result: createdPost,
      image: images,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    imageUrls.map((path) => fs.unlink(path));
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundPost = await prisma.landDetails.findUnique({
      where: {
        id: Number(id),
      },
    });
    await prisma.image.deleteMany({
      where: {
        landDetailsId: Number(id),
      },
    });

    if (!foundPost) {
      createError(400, "post id not found");
    }
    if (req.user.id !== foundPost.userId) {
      createError(400, "Cannot Delete this post");
    }

    const result = await prisma.landDetails.delete({
      where: {
        id: +id,
      },
    });
    res.status(200).json({ message: "Delete successful" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getAllPost = async (req, res, next) => {
  try {
    const landInfo = await prisma.landDetails.findMany({
      omit: {
        userId: true,
      },
      include: {
        image: true,
      },
    });
    res.json({ message: landInfo });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.landDetails.findMany({
      where: {
        id: Number(id),
        userId: { connect: { id: req.user.id } },
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const editPost = async (req, res, next) => {
  try {
    const { landtype, area, location, price, lat, lng } = req.body;

    const landDetailsId = req.params.id;

    const existingLand = await prisma.landDetails.findFirst({
      where: {
        id: parseInt(landDetailsId),
        userId: req.user.id,
      },
    });
    if (!existingLand) {
      createError(403, "Unauthorized or post not found");
    }

    const result = await prisma.landDetails.update({
      where: {
        id: parseInt(landDetailsId),
      },
      data: {
        landtype,
        area,
        location,
        price,
        lat,
        lng,
      },
    });
    res.status(200).json({ message: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
