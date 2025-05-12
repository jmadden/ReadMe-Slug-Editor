// App.js
import React, { useState } from 'react';
import './App.css'; // Optional: component-specific styles

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [enteredApiKey, setEnteredApiKey] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [docs, setDocs] = useState([]);

  const handleApiKeySubmit = e => {
    e.preventDefault();
    setApiKey(enteredApiKey);
    fetchCategories(enteredApiKey);
  };

  const fetchCategories = key => {
    fetch('/api/categories', {
      headers: {
        'x-api-key': key,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      })
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Error fetching categories:', error);
        alert('Error fetching categories. Please check your API key.');
      });
  };

  const handleCategoryClick = category => {
    setSelectedCategory(category);
    fetch(`/api/categories/${category.slug}/docs`, {
      headers: {
        'x-api-key': apiKey,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        return response.json();
      })
      .then(data => {
        const docsWithEdit = data.map(doc => ({
          ...doc,
          editedSlug: doc.slug,
          updateMessage: '',
        }));
        setDocs(docsWithEdit);
      })
      .catch(error => {
        console.error('Error fetching documents:', error);
        alert('Error fetching documents for this category.');
      });
  };

  const handleSlugChange = (index, newSlug) => {
    setDocs(prevDocs => {
      const updatedDocs = [...prevDocs];
      updatedDocs[index].editedSlug = newSlug;
      return updatedDocs;
    });
  };

  const handleDocUpdate = () => {
    docs.forEach((doc, index) => {
      if (doc.slug !== doc.editedSlug) {
        fetch(`/api/docs/${doc.slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({ slug: doc.editedSlug }),
        })
          .then(response => {
            if (response.ok) {
              setDocs(prevDocs => {
                const newDocs = [...prevDocs];
                newDocs[index].updateMessage = 'Slug update successful';
                newDocs[index].slug = newDocs[index].editedSlug;
                return newDocs;
              });
            } else {
              setDocs(prevDocs => {
                const newDocs = [...prevDocs];
                newDocs[index].updateMessage = 'Slug update failed';
                return newDocs;
              });
            }
          })
          .catch(error => {
            console.error('Error updating document:', error);
            setDocs(prevDocs => {
              const newDocs = [...prevDocs];
              newDocs[index].updateMessage = 'Slug update failed';
              return newDocs;
            });
          });
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {!apiKey ? (
        <form onSubmit={handleApiKeySubmit}>
          <h2>Enter your API Key</h2>
          <input
            type='text'
            value={enteredApiKey}
            onChange={e => setEnteredApiKey(e.target.value)}
            placeholder='API Key'
            required
          />
          <button type='submit'>Submit</button>
        </form>
      ) : (
        <div>
          <h2>Categories</h2>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <button onClick={() => handleCategoryClick(category)}>
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
          {selectedCategory && (
            <div style={{ marginTop: '20px' }}>
              <h3>Documents for {selectedCategory.title}</h3>
              <ul>
                {docs.map((doc, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <div>
                      <strong>{doc.title}</strong>
                    </div>
                    <div>Original Slug: {doc.slug}</div>
                    <div>
                      Editable Slug:{' '}
                      <input
                        type='text'
                        value={doc.editedSlug}
                        onChange={e => handleSlugChange(index, e.target.value)}
                      />
                    </div>
                    {doc.updateMessage && (
                      <div style={{ color: 'green' }}>{doc.updateMessage}</div>
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={handleDocUpdate}>Submit Slug Updates</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
