import { HistoryEdu } from '@mui/icons-material';
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import './App.css';

import translateText from './translation/translation-service';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');

  const handleTranslate = async () => {
    const translatedText = await translateText(sourceText);
    setTargetText(translatedText);
  };

  const bibliography = [
    { title: "A Fifteenth Century Cookery Boke", author: "John L. Anderson", year: "1962" },
    { title: "An Ordinance of Pottage. An Edition of the Fifteenth Century Culinary Recipes in Yale University's MS Beinecke 163", author: "Constance B. Hieatt", year: "1988" },
    { title: "Curye on Inglish: English Culinary Manuscripts of the Fourteenth-Century (Including the Forme of Cury)", author: "Constance B. Hieatt and Sharon Butler", year: "1985" },
    { title: "Two Fifteenth-Century Cookery-Books. Harleian MS. 279 & Harl. MS. 4016, with extracts from Ashmole MS. 1429, Laud MS. 553, & Douce MS 55", author: "Thomas Austin", year: "1888" },
  ];

  const minRows = 4;
  const maxRows = 10;

  return (
    <div className="App">
      <div id="AppBody">
        <h1>Medieval Recipe Translator</h1>
        <p>This website offers a simple, word-for-word translation of medieval English recipes into more modern English. It is by no means perfect, and is intended to help budding enthusiasts get familiar with some of the common yet esoteric terms that appear in period manuscripts.</p>
        <p>Translated recipes will still require significant interpretation in most cases. For more beginner-friendly recipes online, I suggest websites like <a href="http://www.godecookery.com/">Gode Cookery</a> and <a href="https://medievalcookery.com/index.html">Medieval Cookery</a>.</p>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Textarea
                color="primary"
                label="Enter text"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                minRows={minRows}
                maxRows={maxRows}
                variant="outlined"
                placeholder="Enter recipe here..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Textarea
                color="primary"
                label="Translated text"
                value={targetText}
                readOnly
                minRows={minRows}
                maxRows={maxRows}
                variant="outlined"
                placeholder="Translation appears here"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryEdu />}
                onClick={handleTranslate}
              >
                Translate
              </Button>
            </Grid>
          </Grid>
        </Box>
        <p>The glossary used by this website was taken from <a href="http://www.godecookery.com/glossary/glossary.htm">Gode Cookery</a>, originally compiled by James L. Matterer from the following sources:</p>
        {bibliography.map((citation, i) => <p key={i} className='citation'><i>{citation.title}</i>. {citation.author}, {citation.year}.</p>)}
      </div>
      <footer>
        <p>Website by <a href="https://github.com/gjcox">Gabriel Cox</a>.</p>
        <p><a href="https://icons8.com/icon/PyrI7GCv8LCv/history">History</a> icon by <a href="https://icons8.com">Icons8.</a></p>
      </footer>
    </div>
  );
}

export default App;