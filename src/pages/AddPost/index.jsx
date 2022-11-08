import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor'; // бибилотека для создания окно ввода текста для поста.
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/authSlice';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios/axios';

export const AddPost = () => {

  const isAuth = useSelector(selectIsAuth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files;
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert('Error image...')
    }
  };

  const onClickRemoveImage = async () => {
    setImageUrl('')
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        text,
        tags: tags.split(','),
        imageUrl,
      }

      setIsLoading(true)

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err)
      alert('Error image...')
    }
  }

  useEffect(() => {
    if ( id ) {
      axios.get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setText(data.text)
          setTags(data.tags.join(','))
          setImageUrl(data.imageUrl)
        })
    }
  }, [])

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if ( window.localStorage.getItem('token') && !isAuth ) {
    return <Navigate to='/'/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden/>
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded"/>
        </>
      )}
      <br/>
      <br/>
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={tags}
        onChange={(e) => setTags(e.currentTarget.value)}
        placeholder="Tags"
        fullWidth/>
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
