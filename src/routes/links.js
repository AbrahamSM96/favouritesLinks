const express = require('express');
const router = express.Router();
// pool es referencia a la base de datos
const pool = require('../database');

router.get('/add', (req, res) =>{
    res.render('../views/links/add.hbs');
});
router.post('/add', async (req, res)=>{
    const{title, url, description} = req.body;
    const newLink = {
        title, 
        url, 
        description
    };
    await pool.query('INSERT INTO links set ?', [newLink]);      
    req.flash('success', 'Link saved succesfully');
    res.redirect('/links');
});

router.get('/', async(req, res)=>{
    const links = await pool.query('SELECT * FROM links');
    
    res.render('../views/links/list.hbs', {links: links});
    
});

router.get('/delete/:id', async(req, res)=>{
    const {id} = req.params;
   await pool.query('DELETE FROM links WHERE id = ?', [id]);
   req.flash('success', 'Links Removed Succesfuly')
   res.redirect('/links');
   console.log(req.params.id);
    
});

router.get('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links[0]);
    res.render('../views/links/edit.hbs', {link: links[0]});
    
});

router.post('/edit/:id', async(req, res) =>{
    const { id } = req.params;
    const { title, description, url} = req.body;
    const newLink = {
        title,
        description, 
        url
    };
    console.log(newLink);
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Links Updated Succesfuly')

    res.redirect('/links');
})

module.exports = router;