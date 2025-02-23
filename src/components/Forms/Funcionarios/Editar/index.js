import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';  
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Container from '@material-ui/core/Container';
import api from '../../../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../utils/showToast'; 
  
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    color: '#004725' 
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  }, 
})); 

export default function FormEditarFuncionario(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [usuarioOriginal, setUsuarioOriginal] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [ativo, setAtivo] = useState('');

  const token = localStorage.getItem('TOKEN');

  useEffect(() => { 
    buscarFuncionario(); 
  }, []);

  async function buscarFuncionario() {
    handleOpen();
    try {
      const getFuncionarioById = await api.get(`/funcionarios/${props.idFuncionario}`, {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      let dados = getFuncionarioById.data[0];  
      setNome(dados.nome);
      setUsuario(dados.usuario); 
      setUsuarioOriginal(dados.usuario)
      setEmail(dados.email);
      setAtivo(dados.ativo)
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Atenção',
            text: 'Sua sessão expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            props.handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    let erros = semErros();

    if (erros.length > 0) {
      let msg = '';
      erros.map(elt => (
          msg += elt
        )
      );
      showMessage('error', msg);
    }
    else { 
      const data = {
        NOME: nome.trim(),
        USUARIO: usuario.trim(),
        USUARIO_ORIGINAL: usuarioOriginal.trim(),
        SENHA: senha ? senha.trim() : null,
        EMAIL: email.trim(),
        ATIVO: ativo 
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/funcionarios/${props.idFuncionario}`, data, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.buscarFuncionarios();
              props.formClose();
            });
          }
        }
      }
      catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            swal({
              title: 'Atenção',
              text: 'Sua sessão expirou, por favor, realize login novamente!',
              icon: "info",
              buttons: "OK"
            }).then((willSuccess) => {
              handleClose();
              props.handleLogout();
            });
          }
        } else {
          handleClose();
          showMessage('error', 'Falha na conexão');
        }
      }
    }
  } 

  function limparCampos() {
    setNome('');
    setUsuario('');
    setSenha('');
    setEmail('');
    setAtivo(false);
  }

  function semErros() {
    let erros = [];
    return erros;
  }

  return (
    <div style={{backgroundColor: '#004725', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar> 
            <Typography variant="h6" className={classes.title} >
              EDITAR FUNCIONÁRIO
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="nome"
                  label="Nome"
                  variant="filled"
                  value={nome}
                  required 
                  onChange={e => setNome(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid> 
              <Grid item xs={12} sm={6}>
                <TextField
                  id="usuario"
                  label="Usuário"
                  variant="filled"
                  value={usuario}
                  required 
                  onChange={e => setUsuario(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid> 
              <Grid item xs={12} sm={6}>
                <TextField
                  id="senha"
                  label="Senha"
                  variant="filled"
                  value={senha} 
                  type="password"
                  onChange={e => setSenha(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid> 
              <Grid item xs={12} sm={10}>
                <TextField
                  id="email"
                  label="Email"
                  variant="filled"
                  value={email}
                  required 
                  type="email"
                  onChange={e => setEmail(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid> 
              <Grid item xs={12} sm={2}> 
                <FormControlLabel
                  control={<Switch checked={ativo} onChange={e => setAtivo(e.target.checked)} />}
                  label="Ativo"
                  style={{color:'#FFFFFF'}}
                />
              </Grid> 
              <Grid item xs={6}>
                <Button type="submit" className="btn-login btn-form">
                  Salvar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button className="btn-login btn-form" onClick={props.formClose}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}