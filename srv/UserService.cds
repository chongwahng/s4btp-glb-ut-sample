using {db} from '../db/data-model';

service UserService @(path : '/user') {
    @readonly
    entity Users as projection on db.Users;

    action lockAccount(id : Users:ID);
    action unlockAccount(id : Users:ID);
}

service APIService @(path : '/api') {
    function myUserInfo() returns String;
}

annotate APIService with @(requires : 'authenticated-user');

annotate UserService.Users with @(restrict : [{
    grant : '*',
    to    : 'Admin',
    where : '$user.company_code = company'
}]);
