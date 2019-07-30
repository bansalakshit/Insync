db.auth('insync_admin', 'F5BE04B7E78AF67F219169E882337D3A')

db = db.getSiblingDB('insync')

db.createUser({
    user: 'insync_user',
    pwd: 'F5BE04B7E78AF67F219169E882337D3A',
    roles: [{
        role: 'readWrite',
        db: 'insync',
    }]
});