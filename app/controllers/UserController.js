class Users {
    static async create({username, password, email})
    {
        const hashedPassword = await hashPassword.hash(password, 10);
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO users (username, password, email)
                VALUES (?, ?, ?)
            `;
            db.run(query, [username, hashedPassword, email], function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, username, email});
            });
        })
    }
}
module.exports = Users;
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Exemple d'utilisation
hashPassword('monMotDePasse').then(hash => console.log(hash));
