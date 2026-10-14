import mongoose from "mongoose";
import { storeProdiSchema } from "../schemas/prodi.schema.js";
import fakultasModel from "../model/fakultas.model.js";
import prodiModel from "../model/prodi.model.js";
import { apiResponse, apiResponseValidation } from "../utils/response.js";

class ProdiController {
  static async index(req, res) {
    const prodis = await prodiModel.find().populate("fakultas");
    return apiResponse({
      res,
      status: 200,
      message: "Berhasil mengambil data prodi",
      data: prodis
    });
  }

  static async show(req, res) {}

  static async store(req, res) {
    const result = storeProdiSchema.safeParse(req.body);

    if (!result.success) {
      return apiResponseValidation({
        res,
        errors: result.error
      });
    }

    const { kode, nama_prodi, fakultas_id } = result.data;

    // Cek apakah Fakultas ada di database
    const isExist = await fakultasModel.exists({
      _id: new mongoose.Types.ObjectId(fakultas_id)
    });

    if (!isExist) {
      return apiResponse({
        res,
        status: 404,
        message: "Fakultas tidak ditemukan",
        data: null
      });
    }

    // Buat data Prodi baru
    const newProdi = await prodiModel.create({
      kode,
      nama_prodi,
      fakultas: fakultas_id
    });

    return apiResponse({
      res,
      status: 201,
      message: "Prodi berhasil dibuat",
      data: newProdi
    });
  }

  static async update(req, res) {}

  static async delete(req, res) {}
}

export default ProdiController;