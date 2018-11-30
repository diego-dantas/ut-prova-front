import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Icon, Popconfirm, Modal, Input, Button, Upload, Row, Col } from "antd";
import {
  FormLabel,
  TextField,
  MenuItem,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core/";
import ButtonUI from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import moment from "moment";

const statusOptions = [
  {
    value: true,
    label: "Ativo"
  },
  {
    value: false,
    label: "Inativo"
  }
];

const enadeOptions = [
  {
    value: true,
    label: "Sim"
  },
  {
    value: false,
    label: "Não"
  }
];

const discursivaOptions = [
  {
    value: true,
    label: "Sim"
  },
  {
    value: false,
    label: "Não"
  }
];

const alternativaOptions = [
  {
    value: "A",
    label: "A"
  },
  {
    value: "B",
    label: "B"
  },
  {
    value: "C",
    label: "C"
  },
  {
    value: "D",
    label: "D"
  },
  {
    value: "E",
    label: "E"
  }
];

const habilidadesOptions = [
  {
    value: "Habilidade A",
    label: "Habilidade A"
  },
  {
    value: "Habilidade B",
    label: "Habilidade B"
  },
  {
    value: "Habilidade C",
    label: "Habilidade C"
  },
  {
    value: "Habilidade D",
    label: "Habilidade D"
  },
  {
    value: "Habilidade E",
    label: "Habilidade E"
  }
];

const conteudosOptions = [
  {
    value: "Conteudo A",
    label: "Conteudo A"
  },
  {
    value: "Conteudo B",
    label: "Conteudo B"
  },
  {
    value: "Conteudo C",
    label: "Conteudo C"
  },
  {
    value: "Conteudo D",
    label: "Conteudo D"
  },
  {
    value: "Conteudo E",
    label: "Conteudo E"
  }
];

const areaConhecimentoOptions = [
  {
    value: "Área de Conhecimento A",
    label: "Área de Conhecimento A"
  },
  {
    value: "Área de Conhecimento B",
    label: "Área de Conhecimento B"
  },
  {
    value: "Área de Conhecimento C",
    label: "Área de Conhecimento C"
  },
  {
    value: "Área de Conhecimento D",
    label: "Área de Conhecimento D"
  },
  {
    value: "Área de Conhecimento E",
    label: "Área de Conhecimento E"
  }
];
const anoOptions = [
  {
    value: "2018",
    label: "2018"
  },
  {
    value: "2017",
    label: "2017"
  },
  {
    value: "2016",
    label: "2016"
  },
  {
    value: "2015",
    label: "2015"
  },
  {
    value: "2014",
    label: "2014"
  },
  {
    value: "2013",
    label: "2013"
  },
  {
    value: "2012",
    label: "2012"
  },
  {
    value: "2011",
    label: "2011"
  },
  {
    value: "2010",
    label: "2010"
  },
  {
    value: "2009",
    label: "2009"
  }
];

const styles = theme => ({
  customFilterDropdown: {
    padding: 8,
    borderRadius: 6,
    background: "#fff",
    boxShadow: "0 1px 6px rgba(0, 0, 0, .2)"
  },
  customFilterDropdownInput: {
    width: 130,
    marginRight: 8
  },
  customFilterDropdownButton: {
    marginRight: 8
  },
  highlight: {
    color: "#f50"
  },
  group: {
    width: "auto",
    height: "auto",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row"
  },
  datePickerTextField: {
    marginTop: 20,
    width: 200
  }
});

class Questoes extends Component {
  constructor(props) {
    super(props);
    this.getHabilidades();
  }

  state = {
    tableData: [],
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
    visibleAlternativa: false,
    confirmLoading: false,
    inId: "",
    inDescricao: "",
    inStatus: true,
    inPadraoEnade: "sim",
    inFonte: "",
    inAno: "",
    inAlternativa: "",
    inHabilidade: "",
    inConteudo: "",
    inAreaConhecimento: "",
    inDiscursiva: "",
    searchText: ""
  };

  /*buildAnoOptions = () => {
    let year = moment();
    var arrayAno = [];
    arrayAno.push(year.format('YYYY'))
    for(let i = 0; i < 9; i++){
      year.subtract(1, 'years');
      arrayAno.push(year.format('YYYY'))
    }

    this.setState({
      anoOptions: {
        value: 'aaaabbbb',
        label: 'aaaabbbb'
      }
    });

    console.log('anoOptions ready!')
  }*/

  getHabilidades = () => {
    axios
      .get(`http://localhost:5000/api/getHabilidades`)
      .then(res => {
        console.log(res.data);
        let tempArray = [];
        let key = 0;
        let labelStatus = null;
        let valueStatus = null;
        res.data.forEach((record, index) => {
          labelStatus = record.status === true ? "Ativo" : "Inativo";
          valueStatus = record.status === false ? false : true;
          tempArray.push({
            key: key,
            id: record.id,
            description: record.description,
            labelStatus: labelStatus,
            valueStatus: valueStatus
          });
          key++;
        });

        this.setState({
          tableData: tempArray
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  createUpdateHabilidade = () => {
    axios
      .post(`http://localhost:5000/api/createUpdateHabilidade`, {
        id: this.state.inId,
        description: this.state.inDescricao,
        status: this.state.inStatus
      })
      .then(res => {
        this.setState({
          visible: false,
          confirmLoading: false,
          inDescricao: ""
        });

        this.getHabilidades();
      })
      .catch(error => {
        console.log(error);
      });
  };

  showModal = rowId => {
    if (typeof rowId == "undefined") {
      // Create
      this.setState({
        inId: "",
        inDescricao: "",
        inStatus: true
      });
    } else {
      // Edit
      this.setState({
        inId: this.state.tableData[rowId].id,
        inDescricao: this.state.tableData[rowId].description,
        inStatus: this.state.tableData[rowId].valueStatus
      });
    }

    this.setState({
      visible: true
    });
  };

  showModalAlternativa = () => {
    this.setState({
      visibleAlternativa: true
    });
  };

handleCancelAlternativa = () => {
    this.setState({
      visibleAlternativa: false
    });
  };


  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    this.createUpdateHabilidade();
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleFormInput = event => {
    const target = event.target;

    this.setState({
      [target.name]: target.value
    });
  };

  handleRemove = rowId => {
    axios
      .post(`http://localhost:5000/api/deleteHabilidade`, {
        id: this.state.tableData[rowId].id
      })
      .then(res => {
        this.getHabilidades();
      })
      .catch(error => {
        console.log(error);
      });
  };

  compareByAlph = (a, b) => {
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  };

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleChange = name => event => {
    console.log("change", event.target.value);
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { selectedRowKeys, visible, confirmLoading,  visibleAlternativa} = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id
      },
      {
        title: "Descrição",
        dataIndex: "description",
        sorter: (a, b) => this.compareByAlph(a.description, b.description),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div className={classes.customFilterDropdown}>
            <Input
              className={classes.customFilterDropdownInput}
              ref={ele => (this.searchInput = ele)}
              placeholder="Buscar"
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button
              className={classes.customFilterDropdownButton}
              type="primary"
              onClick={this.handleSearch(selectedKeys, confirm)}
            >
              Buscar
            </Button>
            <Button
              className={classes.customFilterDropdownButton}
              onClick={this.handleReset(clearFilters)}
            >
              Limpar
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon
            type="search"
            style={{ color: filtered ? "#108ee9" : "#aaa" }}
          />
        ),
        onFilter: (value, record) =>
          record.description.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: text => {
          const { searchText } = this.state;
          return searchText ? (
            <span>
              {text
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, "i"))
                .map(
                  (fragment, i) =>
                    fragment.toLowerCase() === searchText.toLowerCase() ? (
                      <span key={i} className="highlight">
                        {fragment}
                      </span>
                    ) : (
                      fragment
                    ) // eslint-disable-line
                )}
            </span>
          ) : (
            text
          );
        }
      },
      {
        title: "Status",
        dataIndex: "labelStatus",
        align: "center",
        width: 150,
        filters: [
          {
            text: "Ativo",
            value: "Ativo"
          },
          {
            text: "Inativo",
            value: "Inativo"
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.labelStatus.indexOf(value) === 0
      },
      {
        title: "Operação",
        colSpan: 2,
        dataIndex: "operacao",
        align: "center",
        width: 150,
        render: (text, record) => {
          return (
            <React.Fragment>
              <Icon
                type="edit"
                style={{ cursor: "pointer" }}
                onClick={() => this.showModal(record.key)}
              />
              <Popconfirm
                title="Confirmar remoção?"
                onConfirm={() => this.handleRemove(record.key)}
              >
                <a href="/admin/cadastros/questoes" style={{ marginLeft: 20 }}>
                  <Icon type="delete" style={{ color: "red" }} />
                </a>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];

    return (
      <div>
        <h1>Banco de Questões</h1>
        <div style={{ marginBottom: 16 }}>
          <Tooltip title="Adicionar Questão" placement="right">
            <ButtonUI
              variant="fab"
              aria-label="Add"
              onClick={() => this.showModal()}
              style={{ backgroundColor: "#228B22", color: "#fff" }}
            >
              <AddIcon />
            </ButtonUI>
          </Tooltip>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
        
        {/* <Table columns={columns} dataSource={this.state.tableData} /> */}
        
        <Modal
          title="Questão"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          width={900}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={this.handleOk}
            >
              Confirmar
            </Button>
          ]}
        >
          <Row gutter={32}>
            <Col span={8}>
              <TextField
                id="alternativaCorreta"
                select
                label="Habilidade"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inHabilidade}
                onChange={this.handleChange("inHabilidade")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
                >
                {habilidadesOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
           
            <Col span={8}>
              <TextField
                id="alternativaCorreta"
                select
                label="Conteudo"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inConteudo}
                onChange={this.handleChange("inConteudo")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
                >
                {conteudosOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            <Col span={8}>
              <TextField
                id="alternativaCorreta"
                select
                label="Área de Conhecimento"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inAreaConhecimento}
                onChange={this.handleChange("inAreaConhecimento")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
                >
                {areaConhecimentoOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={8}>
              <TextField
                id="status"
                select
                label="Status"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inStatus}
                onChange={this.handleChange("inStatus")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            <Col span={8}>
              <TextField
                id="status"
                select
                label="Padrão Enade"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inPadraoEnade}
                onChange={this.handleChange("inPadraoEnade")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {enadeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            <Col span={8}>
            <TextField
            id="ano"
            select
            label="Ano"
            fullWidth={true}
            className={classes.textField}
            value={this.state.inAno}
            onChange={this.handleChange("inAno")}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {anoOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
            </Col>
          </Row>
          
          <TextField
            id="descricao"
            name="inDescricao"
            value={this.state.inDescricao}
            label="Descrição"
            placeholder="Descrição"
            multiline
            rows="4"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
          
          {/* <FormLabel component="legend" style={{marginTop: 20}}>Padrão Enade</FormLabel>
          <RadioGroup
            aria-label="Padrão Enade"
            className={classes.group}
            value={this.state.inPadraoEnade}
            onChange={this.handleChange("inPadraoEnade")}
          >
            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="não" control={<Radio />} label="Não" />
          </RadioGroup> */}
          <Row gutter={32}>
            <Col span={8}>
              <TextField
                id="fonte"
                name="inFonte"
                value={this.state.inFonte}
                label="Fonte"
                placeholder="Fonte"
                fullWidth={true}
                onChange={this.handleFormInput}
                required
                style={{marginTop: 17}}
              />
            </Col>
            <Col span={8}>
              <TextField
                id="status"
                select
                label="Discursiva"
                fullWidth={true}
                className={classes.textField}
                value={this.state.inDiscursiva}
                onChange={this.handleChange("inDiscursiva")}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {discursivaOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            <Col span={8}>
            <TextField
            id="alternativaCorreta"
            select
            label="Alternativa correta"
            fullWidth={true}
            className={classes.textField}
            value={this.state.inAlternativa}
            onChange={this.handleChange("inAlternativa")}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {alternativaOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
            </Col>
          </Row>
          <br/><br/>
          <Row gutter={48}>
            <Col span={12}>
              <Upload>
                <Button>
                  <Icon type="upload" /> Imagem
                </Button>
              </Upload>
            </Col>
            <Col span={12}>
              <Button
                key="submit"
                type="primary"
                loading={confirmLoading}
                onClick={this.showModalAlternativa}
                style={{float: "right"}}
              >
                Alternativas
              </Button>
            </Col>
          </Row>
        </Modal>

         <Modal
          title="Alternativas"
          visible={visibleAlternativa}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancelAlternativa}
          footer={[
            <Button key="back" onClick={this.handleCancelAlternativa}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={this.handleOk}
            >
              Confirmar
            </Button>
          ]}
        >
          <TextField
            id="fonte"
            name="inFonte"
            value={this.state.inFonte}
            label="Alternativa A"
            placeholder="Alternativa A"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
           <TextField
            id="fonte"
            name="inFonte"
            value={this.state.inFonte}
            label="Alternativa B"
            placeholder="Alternativa B"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
           <TextField
            id="fonte"
            name="inFonte"
            value={this.state.inFonte}
            label="Alternativa C"
            placeholder="Alternativa C"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
           <TextField
            id="fonte"
            name="inFonte"
            value={this.state.inFonte}
            label="Alternativa D"
            placeholder="Alternativa D"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
           <TextField
            id="fonte"
            name="inFonte"
            value={this.state.inFonte}
            label="Alternativa E"
            placeholder="Alternativa E"
            fullWidth={true}
            onChange={this.handleFormInput}
            required
          />
         
        </Modal>
      </div>
    );
  }
}

Questoes.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Questoes);
