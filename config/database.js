const DB = [];

exports.searcInDB = (email) => {
    return DB.find(user => user.email === email)
};

exports.searcIdInDB = (id) => {
    return DB.find(user => user.id === id)
};

exports.printDB = () => {
    return DB;
};

exports.addToDB = (data) =>{
    DB.push(data);
};
