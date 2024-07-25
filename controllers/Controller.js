const multer = require('multer');
const path = require('path');
const fs = require('fs');
const model = require('../model/modeles');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '1111';

let departement = "";

// Fonction pour créer les groupes par défaut s'ils n'existent pas déjà
async function createDefaultGroupsIfNotExist() {
    try {
        const groups = [
            { nom: 'informatique' },
            { nom: 'biologie' },
            { nom: 'langue' },
            { nom: 'mathematiques' }
        ];

        for (const group of groups) {
            const existingGroup = await model.Group.findOne({ nom: group.nom });
            if (!existingGroup) {
                const newGroup = new model.Group({
                    nom: group.nom,
                    historiques: [],
                    missions: [],
                    presentations: [],
                    enseignants: [],
                    formations: [],
                    realisations: [],
                    actualites: [],
                    entreprises: []
                });

                await newGroup.save();
                console.log(`Groupe ${group.nom} créé avec succès.`);
            } else {
                console.log(`Le groupe ${group.nom} existe déjà.`);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la création des groupes par défaut :', error);
    }
}

createDefaultGroupsIfNotExist();

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'Image') {
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
});

exports.index = (req, res) => res.render('main');
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.render('main');
}

const renderView = (viewName, data = {}) => (req, res) => res.render(viewName, data);

const getDataAndRenderView = (Model, fieldName, viewName) => async (req, res) => {
    let name = req.params.id || departement;

    try {
        const group = await Model.findOne({ nom: name });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        renderView(viewName, { [fieldName]: group[fieldName] })(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting data' });
    }
};

// Routes GET
exports.Actualite = getDataAndRenderView(model.Group, 'actualites', 'actualite');
exports.Enseignant = getDataAndRenderView(model.Group, 'enseignants', 'enseignant');
exports.Formation = getDataAndRenderView(model.Group, 'formations', 'formation');
exports.Historique = getDataAndRenderView(model.Group, 'historiques', 'historique');
exports.Mission = getDataAndRenderView(model.Group, 'missions', 'mission');
exports.Presentation = getDataAndRenderView(model.Group, 'presentations', 'presentation');
exports.Realisation = getDataAndRenderView(model.Group, 'realisations', 'realisation');
exports.Entreprise = getDataAndRenderView(model.Group, 'entreprises', 'entreprise');

// Generic function for GET requests
const getAllDocuments = (Model, fieldName) => async (req, res) => {
    let name = req.params.id || departement;

    try {
        const group = await Model.findOne({ nom: name });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group[fieldName]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting data' });
    }
};


const getEnseignants = (Model, fieldName) => async (req, res) => {
    let name = req.params.id || departement;

    try {
        const group = await Model.findOne({ nom: name });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group[fieldName]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting data' });
    }
};


const update = (Model,fieldName) => async (req, res) => {
    upload.single('Image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error uploading file', error: err });
        }

        try {
            const group = await Model.findOne({ nom: departement });
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            if (req.file) {
                const fileUrl = `/files/${req.file.filename}`;
                req.body.Image = fileUrl; 
            }

            group[fieldName].push(req.body);
            await group.save();
        } catch (error) {
            console.error(error);
        }
    });
};



// Generic function for POST requests
const createDocument = (Model,fieldName) => async (req, res) => {
    upload.single('Image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error uploading file', error: err });
        }

        try {
            const group = await Model.findOne({ nom: departement });
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            if (req.file) {
                const fileUrl = `/files/${req.file.filename}`;
                req.body.Image = fileUrl; 
            }

            group[fieldName].push(req.body);
            await group.save();
        } catch (error) {
            console.error(error);
        }
    });
};
const updateDocument = (Model, fieldName) => async (req, res) => {
    upload.single('Image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error uploading file', error: err });
        }

        try {
            const updates = req.body;
            let fileUrl;
            let filename;
            if (req.file) {
                fileUrl = `/files/${req.file.filename}`;
                updates.Image = fileUrl;
                filename = req.file.filename;
            }

            // Construct the update object with the dot notation to avoid conflicts
            const updateObject = {};
            for (const key in updates) {
                updateObject[`${fieldName}.$.${key}`] = updates[key];
            }

            const group = await Model.findOneAndUpdate(
                { nom: departement, [`${fieldName}._id`]: req.params.id },
                { $set: updateObject },
                { new: true, runValidators: true }
            );

            if (!group) {
                return res.status(404).json({ message: 'Group or document not found' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating document', error });
        }
    });
};


const updateIsActive = (Model, fieldName) => async (req, res) => {
    try {
        const group = await Model.findOne({ nom: departement });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const document = group[fieldName].id(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        document.activated = req.body.activated;
        await group.save();
        res.json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' });
    }
};

// User management
exports.Signup = async (req, res) => {
    const { email, password, departement } = req.body;
    try {
        const existingUser = await model.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new model.User({ email, password, departement });
        await newUser.save();
        await exports.Signin(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.Signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await model.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        departement = user.departement;
        const payload = { email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000 });
        res.render(departement);
    } catch (error) {
        res.status(500).json({ message: 'Error during authentication', error });
    }
};

// Routes GET
exports.Getinfosenseignant=getEnseignants(model.Group,'enseignants');
exports.Getmission = getAllDocuments(model.Group, 'missions');
exports.Getpresentation = getAllDocuments(model.Group, 'presentations');
exports.Gethistorique = getAllDocuments(model.Group, 'historiques');
exports.Getenseignant = getAllDocuments(model.Group, 'enseignants');
exports.Getformation = getAllDocuments(model.Group, 'formations');
exports.Getrealisation = getAllDocuments(model.Group, 'realisations');
exports.Getactualite = getAllDocuments(model.Group, 'actualites');
exports.Getentreprise = getAllDocuments(model.Group, 'entreprises');

// Routes POST
exports.Postentreprise = createDocument(model.Group, 'entreprises');
exports.Postmission = createDocument(model.Group, 'missions');
exports.Postpresentation = createDocument(model.Group, 'presentations');
exports.Posthistorique = createDocument(model.Group, 'historiques');
exports.Postenseignant = createDocument(model.Group, 'enseignants');
exports.Postformation = createDocument(model.Group, 'formations');
exports.Postrealisation = createDocument(model.Group, 'realisations');
exports.Postactualite = createDocument(model.Group, 'actualites');

// Routes PUT
exports.Updateinfosenseignants=update(model.Group,'enseignants');
exports.Updateentreprise = updateDocument(model.Group, 'entreprises');
exports.Updatemission = updateDocument(model.Group, 'missions');
exports.Updatepresentation = updateDocument(model.Group, 'presentations');
exports.Updatehistorique = updateDocument(model.Group, 'historiques');
exports.Updateenseignant = updateDocument(model.Group, 'enseignants');
exports.Updateformation = updateDocument(model.Group, 'formations');
exports.Updaterealisation = updateDocument(model.Group, 'realisations');
exports.Updateactualite = updateDocument(model.Group, 'actualites');

// Routes PATCH (Update activated)
exports.Activateentreprise = updateIsActive(model.Group, 'entreprises');
exports.ActivateMission = updateIsActive(model.Group, 'missions');
exports.ActivatePresentation = updateIsActive(model.Group, 'presentations');
exports.ActivateHistorique = updateIsActive(model.Group, 'historiques');
exports.ActivateEnseignant = updateIsActive(model.Group, 'enseignants');
exports.ActivateFormation = updateIsActive(model.Group, 'formations');
exports.ActivateRealisation = updateIsActive(model.Group, 'realisations');
exports.ActivateActualite = updateIsActive(model.Group, 'actualites');
