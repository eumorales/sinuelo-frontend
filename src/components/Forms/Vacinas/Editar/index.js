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
import FormControl from '@material-ui/core/FormControl'; 
import Autocomplete from '@material-ui/lab/Autocomplete'; 
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

export default function FormEditarVacina(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [descricao, setDescricao] = useState(''); 
  const [obrigatorio, setObrigatorio] = useState(false);
  const [modoUso, setModoUso] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const token = localStorage.getItem('TOKEN');
 
  useEffect(() => {
    buscarVacina(); 
  }, []);
 
  async function buscarVacina() {
    handleOpen();
    try {
      const getDadosVacina = await api.get(`/vacinas/${props.idVacina}`, {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      let dados = getDadosVacina.data[0];  
      setDescricao(dados.descricao); 
      setObrigatorio(dados.ind_obrigatorio);
      setModoUso(dados.modo_uso);
      setDetalhes(dados.detalhes);
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

  async function handleEdit(e) {
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
        DESCRICAO: descricao.trim(), 
        IND_OBRIGATORIO: obrigatorio ? 'S' : 'N',
        MODO_USO: modoUso.trim(),
        DETALHES: detalhes.trim(),
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/vacinas/${props.idVacina}`, data, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();   
              props.buscarVacinas();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.buscarVacinas();
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
    setDescricao(''); 
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
              EDITAR VACINAS
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end"> 
              <Grid item xs={12} sm={10}>
                <TextField
                  id="descricao"
                  label="Descrição"
                  variant="filled"
                  required
                  value={descricao} 
                  onChange={e => setDescricao(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                /> 
              </Grid>  
              <Grid item xs={12} sm={2}> 
                <FormControlLabel
                  control={<Switch onChange={e => setObrigatorio(e.target.checked)} checked={obrigatorio} />}
                  label="Obrigatória" 
                  value={obrigatorio}
                  style={{color:'#FFFFFF'}}
                />
              </Grid> 
              <Grid item xs={12}>
                <TextField
                  id="modoUso"
                  label="Modo de uso"
                  variant="filled"
                  value={modoUso}   
                  required
                  onChange={e => setModoUso(e.target.value)} 
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  size="small"   
                /> 
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="detalhes"
                  label="Detalhes"
                  variant="filled"
                  value={detalhes} 
                  required
                  onChange={e => setDetalhes(e.target.value)} 
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  size="small"   
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