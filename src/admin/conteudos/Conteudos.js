import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Popconfirm, Modal, Input, Button } from 'antd';
import { TextField, MenuItem, Tooltip } from '@material-ui/core/';
import ButtonUI from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const statusOptions = [{
    value: true,
    label: 'Ativo'
},
{
    value: false,
    label: 'Inativo'
}];

const styles = ({
    customFilterDropdown: {
        padding: 8,
        borderRadius: 6,
        background: '#fff',
        boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
    },
    customFilterDropdownInput: {
        width: 130,
        marginRight: 8
    },
    customFilterDropdownButton: {
        marginRight: 8
    },
    highlight: {
        color: '#f50'
    }
})

class Conteudos extends Component {
    constructor(props) {
        super(props);
        this.getConteudos();
    }

    state = {
        tableData: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        confirmLoading: false,
        inId: '',
        inDescricao: '',
        inStatus: true,
        searchText: ''
    };

    getConteudos = () => {
        axios.get(`http://localhost:5000/api/getConteudos`)
		.then(res => {
            let tempArray = [];
            let key = 0;
            let labelStatus = null;
            let valueStatus = null;
            res.data.forEach((record, index) => {
                labelStatus = record.status === true ? 'Ativo' : 'Inativo';
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
		.catch(error =>{
			console.log(error)
        })
    }

    createUpdateConteudo = () => {
        axios.post(`http://localhost:5000/api/createUpdateConteudo`, {
            id: this.state.inId,
            description: this.state.inDescricao,
            status: this.state.inStatus
		})
		.then(res => {
			this.setState({
                visible: false,
                confirmLoading: false,
                inDescricao: ''
            });

            this.getConteudos();
		})
		.catch(error =>{
            console.log(error)
		})
    }

    showModal = (rowId) => {
        if(typeof(rowId) == "undefined") {
            // Create
            this.setState({
                inId: '',
                inDescricao: '',
                inStatus: true
            })
        }
        else {
            // Edit
            this.setState({
                inId: this.state.tableData[rowId].id,
                inDescricao: this.state.tableData[rowId].description,
                inStatus: this.state.tableData[rowId].valueStatus
            })
        }

        this.setState({
            visible: true
        });
    }
    
    handleOk = () => {
        this.setState({
          confirmLoading: true,
        });
        this.createUpdateConteudo();
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleFormInput = (event) => {
		const target = event.target;
		
		this.setState({
			[target.name]: target.value
        });
    }
    
    handleRemove = (rowId) => {
        axios.post(`http://localhost:5000/api/deleteConteudo`, {
            id: this.state.tableData[rowId].id
		})
		.then(res => {
            this.getConteudos();
		})
		.catch(error =>{
			console.log(error)
		})
    }

    compareByAlph = (a, b) => {
        if (a > b)
            return -1;
        if (a < b)
            return 1;
        return 0;
    }

    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render(){
        const { classes } = this.props;
        const {selectedRowKeys, visible, confirmLoading } = this.state;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        }, {
            title: 'Descrição',
            dataIndex: 'description',
            sorter: (a, b) => this.compareByAlph(a.description, b.description),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={classes.customFilterDropdown}>
                    <Input
                        className={classes.customFilterDropdownInput}
                        ref={ele => this.searchInput = ele}
                        placeholder="Buscar"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={this.handleSearch(selectedKeys, confirm)}
                    />
                    <Button className={classes.customFilterDropdownButton} type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Buscar</Button>
                    <Button className={classes.customFilterDropdownButton} onClick={this.handleReset(clearFilters)}>Limpar</Button>
                </div>
            ),
            filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
            onFilter: (value, record) => record.description.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    });
                }
            },
            render: (text) => {
                const { searchText } = this.state;
                return searchText ? (
                    <span>
                        {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                            ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                    </span>
                ) : text;
            }
        }, {
            title: 'Status',
            dataIndex: 'labelStatus',
            align: 'center',
            width: 150,
            filters: [{
                text: 'Ativo',
                value: 'Ativo',
            }, {
                text: 'Inativo',
                value: 'Inativo',
            }],
            filterMultiple: false,
            onFilter: (value, record) => record.labelStatus.indexOf(value) === 0
        }, {
            title: 'Operação',
            colSpan: 2,
            dataIndex: 'operacao',
            align: 'center',
            width: 150,
            render: (text, record) => {
                return(
                    <React.Fragment>
                        <Icon type="edit" style={{cursor: 'pointer'}}onClick={() => this.showModal(record.key)} />
                        <Popconfirm title="Confirmar remoção?" onConfirm={() => this.handleRemove(record.key)}>
                            <a href="/admin/cadastros/conteudos" style={{marginLeft: 20}}><Icon type="delete" style={{color: 'red'}} /></a>
                        </Popconfirm>
                    </React.Fragment>
                );
            }
        }];

        return(
            <div>
                <h1>Conteúdos</h1>
                <div style={{ marginBottom: 16 }}>
                <Tooltip title="Adicionar Conteudo" placement="right">
                    <ButtonUI 
                        variant="fab" 
                        aria-label="Add" 
                        onClick={() => this.showModal()}
                        style={{backgroundColor: '#228B22', color: '#fff'}}>
                        <AddIcon />
                    </ButtonUI>
                    </Tooltip>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                
                <Table 
                    columns={columns} 
                    dataSource={this.state.tableData} 
                />
                <Modal
                    title="Conteúdo"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cancelar</Button>,
                        <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk}>
                            Confirmar
                        </Button>
                    ]}
                >
                    <TextField
                        id="descricao"
                        name="inDescricao"
                        value={this.state.inDescricao}
                        label="Descrição"
                        placeholder='Descrição'
                        fullWidth={true}
                        onChange={this.handleFormInput}
                        required
                    />
                    <TextField
                        id="status"
                        select
                        label="Status"
                        fullWidth={true}
                        className={classes.textField}
                        value={this.state.inStatus}
                        onChange={this.handleChange('inStatus')}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {
                            statusOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Modal>
          </div>
        )
    }
}

Conteudos.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Conteudos);