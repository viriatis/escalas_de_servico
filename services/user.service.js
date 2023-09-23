
const MilitarRepository = require('../repository/militar.repository');
const User = require('../models/user');
const UserRepository = require('../repository/user.repository');

exports.criar_user = async function (body) {
    let nim = body.nim;

    let militar = await MilitarRepository.GetMilitarByNIM(nim).catch(err => {
        return err;
    })

    let user = await UserRepository.GetUserByMilitarId(militar.id).catch(err => {
        console.log(err)
    })


    if (militar) {

        if (!user) {
            let user = new User();
            user.militar = militar.id

            user.password = body.password
            user.passwordtelegram = body.passwordtelegram

            let newUser = await UserRepository.SaveUser(user).catch(err => {
                return err;
            })

            return newUser;
        } else {

            user.password = body.password
            user.passwordtelegram = body.passwordtelegram

            let newUser = await UserRepository.UpdateUser(user).catch(err => {
                return err;
            })

            return newUser;
        }
    } else {
        return false
    }

}

exports.ver_users = async function(){
    let lista = await UserRepository.AllUsers().catch(err => {
        return err;
    })

    return lista
}

exports.get_userbyId = async function(id){
    let user = await UserRepository.GetById(id).catch(err => {
        return err;
    })

    if(user){
        return user
    }else{
        return null
    }
        
}

exports.permissaoGestor = async function(id, body){
    let user = await UserRepository.GetById(id).catch(err => {
        return err;
    })

    if(user){
        user.gestor = body.gestor
        
        user = await UserRepository.UpdateUser(user).catch(err => {  return err       })

        return user
    }else{
        return null
    }
    
        
}
exports.apagar_user = async function(id, body){
    let user = await UserRepository.GetById(id).catch(err => {
        return err;
    })

    if(user){
        user.gestor = false
        user.password = ''
        user.passwordtelegram = ''
        
        user = await UserRepository.UpdateUser(user).catch(err => {  return err       })

        return user
    }else{
        return null
    }
    
        
}
