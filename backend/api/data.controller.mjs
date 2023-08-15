// data.controller.mjs

import DataDAO from "../dao/dataDAO.js";

export default class DataController {
  static async getData(req, res, next) {
    try {
      const data = await DataDAO.getData();
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async getItem(req, res, next) {
    try {
      const data = await DataDAO.getItem();
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async updateData(req, res, next) {
    const itemId = req.params.itemId; // Assuming the itemId is passed as a route parameter

    try {
      const currentStatus = await DataDAO.getProductStatus(itemId);
      console.log("Current Status:", currentStatus);

      let newStatus;

      if (currentStatus === "pending") {
        newStatus = "Processing";
      } else if (currentStatus === "Processing") {
        newStatus = "Done";
      } else if (currentStatus === "Done") {
        newStatus = "Delivered";
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid current product status" });
        return;
      }

      const updateSuccessful = await DataDAO.updateItem(itemId, newStatus);
      if (updateSuccessful) {
        res.json({
          success: true,
          message: "Product status updated successfully",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to update product status" });
      }
    } catch (err) {
      console.error(`Error updating product status: ${err}`);
      res.status(500).json({ success: false, error: err });
    }
  }

  static async getUserOrders(req, res, next) {
    const email = req.params.email; // Assuming the email is passed as a route parameter
    try {
      const orders = await DataDAO.getUserOrders(email);

      // Filter orders where the orderStatus is not equal to 'Delivered'
      const filteredOrders = orders.filter(
        (order) => order.productStatus !== "Delivered"
      );

      res.json(filteredOrders);
    } catch (err) {
      console.error(`Error getting user orders: ${err}`);
      res.status(500).json({ error: err });
    }
  }

  static async updateDataValue(req, res, next) {
    const value = req.body.value; // Assuming the itemId is passed as a route parameter

    try {
      const updateSuccessful = await DataDAO.updateData(value);

      if (updateSuccessful) {
        res.json({ success: true, message: "Data ID updated successfully" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to update Data ID" });
      }
    } catch (err) {
      console.error(`Error updating Data ID: ${err}`);
      res.status(500).json({ success: false, error: err });
    }
  }

  // static async addData(req, res, next) {
  //   try {
  //     const { temperature, humidity, value } = req.body;
  //     const result = await DataDAO.addData(temperature, humidity, value);
  //     if (result === 1) {
  //       res.json({ message: "Data added successfully" });
  //     } else {
  //       throw new Error("Failed to add data");
  //     }
  //   } catch (err) {
  //     console.error(`Error adding data: ${err}`);
  //     res.status(500).json({ error: err });
  //   }
  // }

  static async addSale(req, res, next) {
    try {
      const { customerName, products, totalPrice, productStatus, email } =
        req.body;
      const result = await DataDAO.addSale(
        customerName,
        products,
        totalPrice,
        productStatus,
        email
      );
      if (result) {
        res.json({ success: true, message: "Sale added successfully" });
      } else {
        throw new Error("Failed to add sale");
      }
    } catch (err) {
      console.error(`Error adding sale: ${err}`);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSale(req, res, next) {
    try {
      const data = await DataDAO.getSale();
      res.json(data);
    } catch (err) {
      console.error(`Error getting data: ${err}`);
      res.status(500).json({ error: err });
    }
  }
}
