import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';

const Home = () => {
  const [surahNumber, setSurahNumber] = useState('');
  const [searchKeywordValue, setSearchKeywordValue] = useState('');
  const [surahData, setSurahData] = useState('');
  const [keywordData, setKeywordData] = useState('');
  const [surahErrorMessage, setSurahErrorMessage] = useState('');
  const [keywordErrorMessage, setKeywordErrorMessage] = useState('');

  const fetchQuranData = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Quran data:', error);
    }
  };

  const clearSurahData = () => {
    setSurahData('');
    setSurahNumber('');
    setSurahErrorMessage('');
  };

  const clearKeywordData = () => {
    setKeywordData('');
    setSearchKeywordValue('');
    setKeywordErrorMessage('');
  };

  const searchSurah = async () => {
    if (!surahNumber.trim()) {
      setSurahErrorMessage('Please enter a surah number.');
      return;
    }

    try {
      const data = await fetchQuranData();
      if (data && data.data && data.data.surahs) {
        const surah = data.data.surahs.find(surah => surah.number === parseInt(surahNumber));
        if (surah) {
          let html = `<h2>${surah.englishName}</h2>`;
          surah.ayahs.forEach(ayah => {
            html += `<p><strong>${ayah.numberInSurah}:</strong> ${ayah.text}</p>`;
          });
          setSurahData(html);
        } else {
          setSurahErrorMessage('Surah not found.');
        }
      } else {
        setSurahErrorMessage('Failed to fetch Quran data.');
      }
    } catch (error) {
      console.error('Error searching surah:', error);
      setSurahErrorMessage('Failed to search for the surah.');
    }
  };

  const searchKeyword = async () => {
    if (!searchKeywordValue.trim()) {
      setKeywordErrorMessage('Please enter a keyword.');
      return;
    }

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/search/${searchKeywordValue}/all/en`);
      const searchData = await response.json();

      if (searchData && searchData.data && searchData.data.matches) {
        let html = '<h2>Search Results:</h2>';
        searchData.data.matches.forEach(match => {
          html += `<p><strong>Surah ${match.surah.number}, Ayah ${match.numberInSurah}:</strong> ${match.text}</p>`;
        });
        setKeywordData(html);
      } else {
        setKeywordData('<p>No matches found.</p>');
      }
    } catch (error) {
      console.error('Error searching keyword:', error);
      setKeywordErrorMessage('Failed to search for the keyword.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">Quran  </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter Surah Number"
            type="number"
            value={surahNumber}
            onChange={(e) => setSurahNumber(e.target.value)}
            inputProps={{ min: 1, max: 114 }}
            fullWidth
          />
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="success" onClick={searchSurah}>Search</Button>
            <Button variant="contained" color="error" onClick={clearSurahData} sx={{ ml: 1 }}>Clear</Button>
          </Box>
          {surahErrorMessage && <Typography color="error" align="center" mt={2}>{surahErrorMessage}</Typography>}
          <Box mt={2} dangerouslySetInnerHTML={{ __html: surahData }}></Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search for Keyword"
            type="text"
            value={searchKeywordValue}
            onChange={(e) => setSearchKeywordValue(e.target.value)}
            fullWidth
          />
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="success" onClick={searchKeyword}>Search</Button>
            <Button variant="contained" color="error" onClick={clearKeywordData} sx={{ ml: 1 }}>Clear</Button>
          </Box>
          {keywordErrorMessage && <Typography color="error" align="center" mt={2}>{keywordErrorMessage}</Typography>}
          <Box mt={2} dangerouslySetInnerHTML={{ __html: keywordData }}></Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
