import primasClient from '../../prisma'
import {hash} from 'bcryptjs'

interface UserResquest{
    name: string;
    email: string;
    password:string;
}
class CreateUserService{
    async execute({name, email, password}:UserResquest){

        //verifica se ele enviou email
        if (!email) {
            throw new Error("Email incorrect")
        }

        //verifcar se esse email já está cadastrado na plataforma
        const userAlreadyExists = await primasClient.user.findFirst({
            where:{
                email: email
            }
        })

        if (userAlreadyExists) {
            throw new Error("User already exists")
        }

        const passwordHash = await hash(password, 8)


        const user = await primasClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash

            },
            select:{
                id: true,
                name:true,
                email: true
            }
        })


        return user
    }
}

export {CreateUserService}