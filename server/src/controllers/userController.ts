import {Location} from "../models/Location";
import {Request, Response} from 'express';
import {User} from "../models/User";


interface UserBody {
    email: string;
    password: string;
}

export const registerUser = async (req: Request<{},{},UserBody>, res: Response) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if(user) {
        throw new Error('User already exists');
    }

    const newUser = User.create({
        email,
        passwordHash: password
    })

}