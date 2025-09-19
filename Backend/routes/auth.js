import { Router } from "express";
import bcrypt from "bcrypt";
import { authorize, issueToken, Roles } from "../middleware/auth.js";
import userModel from "../model/userSchema.js";

const router = Router();

/* Add A New User 
   only admin can adduser to there respective organization
*/
router.post("/adduser", authorize(Roles.Admin), async (req, res) => {
  const { email_id, password, role } = req.body;
  const { tenant_id } = req.user;

  if (Roles.All.indexOf(role) === -1) {
    res.status(403).json({ code: 4034,message: "Invalid role" });
    return;
  }
  //fetching tenant_id
  if (!tenant_id)
    return res.status(400).json({ message: "tenant_id not found" });
  bcrypt.hash(password, 10).then(async function (hashedPassword) {
    const insertData = { tenant_id, email_id, password: hashedPassword, role };

	//Checking if user Already exists or not
	let user = await userModel.find({email_id, tenant_id})
	if(user.length !== 0){
		res.status(400).json({message: "Email Id already registered!"});
		return
	}

	try {
	  //Inserting user into db
	  const result = userModel.insertOne(insertData);
      const newUser = { _id: result.insertedId,tenant_id, email_id, role };
      const token = issueToken(newUser);
      res.status(200).json({ ...newUser, token });
	} catch (error) {
		console.log(error);
        return res.status(400).json({ message: "Error: Could not add user"});
	}
  });
});

router.post("/login", async (req, res) => {
  const { email_id, password } = req.body;
  const query = { email_id };
  try {
	const user = await userModel.findOne(query);

	// No record found for the given emailId
	if (!user) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }

	//User found
    const hashedPassword = user.password;
    let isPasswordCorrect;

    try {
      //comparing passwords
      isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    } catch (errBcrypt) {
      console.log(errBcrypt);
      return res
        .status(400)
        .json({ message: "Error: Could not get user password" });
    }

    // Wrong password given
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Credentials" , password: password, hashedPassword});
    }

    //User authenticated
	const userData = user._doc;
    delete userData.password;

    const token = issueToken(userData);
    return res.status(200).json({ ...userData, token });
  } catch (error) {
	console.log(error);
      return res
        .status(400)
        .json({ message: "Error: Could not get user details" });
  }

    
  });

export default router;
