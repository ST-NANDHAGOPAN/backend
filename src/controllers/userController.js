const {UserModel, UserAddressModel} = require('../models/userModel');
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken");
const { UserRegisterModel, AdminRegisterModel } = require('../models/authModel');

exports.getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.items_per_page) || 10; 
    const pageIndex = parseInt(req.query.page) || 1; 
    const skip = limit * (pageIndex - 1); 

    let sort = {};
    const sortBy = req.query.sort || 'createdAt'; // Default sorting by createdAt
    const sortOrder = req.query.order === 'desc' ? -1 : 1; // Default order is ascending

    sort[sortBy] = sortOrder;
    const pipeline = [
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];
    const data = await UserModel.aggregate(pipeline);
    const totalData = await UserModel.countDocuments();
    const totalDataReceived = data.length
    const totalPages = Math.ceil(totalData / limit); 

    const pagination = {
      page: pageIndex,
      first_page_url: `/?page=1`,
      from: skip + 1,
      last_page: totalPages,
      links: [],
      next_page_url: pageIndex < totalPages ? `/?page=${pageIndex + 1}` : null,
      items_per_page: limit.toString(),
      prev_page_url: pageIndex > 1 ? `/?page=${pageIndex - 1}` : null,
      to: skip + data.length,
      totalData: totalData ,
      totalDataReceived: totalDataReceived
    };

    // Generating links for pagination
    if (pageIndex > 1) {
      pagination.links.push({
        url: `/?page=${pageIndex - 1}`,
        label: "&laquo; Previous",
        active: false,
        page: pageIndex - 1
      });
    }

    for (let i = 1; i <= totalPages; i++) {
      pagination.links.push({
        url: i === pageIndex ? null : `/?page=${i}`,
        label: i.toString(),
        active: i === pageIndex,
        page: i
      });
    }

    if (pageIndex < totalPages) {
      pagination.links.push({
        url: `/?page=${pageIndex + 1}`,
        label: "Next &raquo;",
        active: false,
        page: pageIndex + 1
      });
    }

    res.json({ pagination: pagination, data: data, message: "Data GET Success" });
  } catch (error) {
    res.status(500).json({ message: "Internal error: " + error });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserModel.findById(id);
    res.json({ data: data, message: "Unique Data GET Success" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, age, email, address } = req.body;
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const  filename  = req.file.originalname; 
    const fileData = req.file.buffer;
    const uploadDir = path.join(__dirname , ".." , ".." , "public" , "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadDir, filename), fileData);

    const postData = new UserModel({
      name: name,
      age: age,
      email: email,
      address: address,
      image :filename,
    });
    await postData.save();
    const responseData = {
      receivedData: postData,
      message: "Data Received Successfully",
    };
    res.json(responseData);
  } catch (error) {
    res.status(500).send({ message: "Internal error: " + error });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, age, email, address } = req.body;
    let updateData = { name, age, email, address };
    
    if (req.file) {
      const filename = req.file.originalname;
      const fileData = req.file.buffer;
      const uploadDir = path.join(__dirname , ".." , ".." , "public" , "uploads");
      
      // Save the new image file to the server
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), fileData);

      // Add the image filename to the update data
      updateData.image = filename;
    }
    const putData = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!putData) {
      return res.status(404).json({ message: "Data not found" });
    }
    const responseData = {
      receivedData: putData,
      message: "Data Updated Successfully",
    };
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal error: " + error });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await UserModel.findByIdAndDelete(id);
    if (!deleteData) {
      return res.status(404).json({ message: "Data not found" });
    }
    const responseData = { message: "Data Deleted Successfully" };
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal error: " + error });
  }
};

exports.getuserAddress = async (req,res) => {
  try {
    // Step 4: Query the database for all user details
    const users = await UserAddressModel.find({});
    const totalData = await UserAddressModel.countDocuments();
    // Step 5: Send the retrieved user details as a response
    res.status(200).json({data: users, totalData:totalData, message: "Data GET Success"});
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getUserAddressById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserAddressModel.findById(id);
    res.json({ data: data, message: "Unique Data GET Success" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.createUserAddress = async (req, res) => {
  try {
    const { first_name, last_name, address, phone_no  } = req.body;
    const token = req.headers.authorization;
    const tokenWithoutBearer = token.split(' ')[1];

    const dbw = jwt.verify(tokenWithoutBearer,process.env.JWT_SECRET);
    console.log("dbw",dbw);
    const userdata = await AdminRegisterModel.find({email:dbw.email})
    console.log("user_id" ,userdata);

    const user_id = userdata[0]._id

    const postData = new UserAddressModel({
      first_name: first_name,
      last_name: last_name,
      address: address,
      phone_no :phone_no,
      user_id : user_id
    });
    await postData.save();
    const responseData = {
      receivedData: postData,
      message: "Data Received Successfully",
    };
    res.json(responseData);
  } catch (error) {
    res.status(500).send({ message: "Internal error: " + error });
  }
};

exports.updateUserAddressById = async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, address, phone_no } = req.body;
    const putData = await UserAddressModel.findByIdAndUpdate(
      id,
      { first_name, last_name, address, phone_no },
      { new: true }
    );
    if (!putData) {
      return res.status(404).json({ message: "Data not found" });
    }
    const responseData = {
      receivedData: putData,
      message: "Data Updated Successfully",
    };
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal error: " + error });
  }
};

exports.deleteUserAddressById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await UserAddressModel.findByIdAndDelete(id);
    if (!deleteData) {
      return res.status(404).json({ message: "Data not found" });
    }
    const responseData = { message: "Data Deleted Successfully" };
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal error: " + error });
  }
};