import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Popconfirm, Form, Tag, Progress, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  getStatusTagColor,
  getTypeTagColor,
  getPriorityTagColor,
} from './styleHelpers';
import { formatDate, sortComments, sortDate } from '../services/helpers';
import { editAnalysis, getAnalysesByFamily } from '../services/services';

const EditableContext = React.createContext<any | undefined>(undefined);

type State = {
  dataSource: any;
  initialDataSource: any;
  count: number;
};
type Props = {
  dataSource: any[];
  rowKey: string;
  isVisible: boolean;
  hideSearch: boolean;
};

const EditableRow: React.FunctionComponent<any> = ({
  index,
  ...props
}: any) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FunctionComponent<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: any) => {
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef();
  const form: any = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef?.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      editAnalysis(record.id, 'comment', undefined, values.comment).then(() => {
        handleSave({ ...record, ...values });
        toggleEdit();
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 10,
        }}
        name={dataIndex}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          placeholder="Type comment"
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minHeight: 40,
          minWidth: 20,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export class EditableTable extends React.Component<Props, State> {
  private columns: any[];
  constructor(props) {
    super(props);

    this.state = {
      dataSource: this.props.dataSource,
      initialDataSource: this.props.dataSource,
      count: this.props.dataSource.length,
    };

    this.columns = [
      {
        title: 'Family',
        dataIndex: 'family',
        key: 'family',
        sorter: (a, b) => a.family.length - b.family.length,
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (type: any) => {
          return (
            type && (
              <Tag color={getPriorityTagColor(type)} key={type}>
                {type.toUpperCase()}
              </Tag>
            )
          );
        },
        filters: [
          {
            text: 'Low',
            value: 'low',
          },
          {
            text: 'Normal',
            value: 'normal',
          },
          {
            text: 'High',
            value: 'high',
          },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record?.priority?.indexOf(value) === 0,
      },
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        // eslint-disable-next-line react/display-name
        render: (id: any) => <Link to={`${id}`}>{id}</Link>,
      },
      {
        title: 'Started',
        dataIndex: 'started',
        key: 'started',
        render: (date: string) => formatDate(date),
        sorter: (a, b) => sortDate(a.started, b.started),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type: any) =>
          type && (
            <Tag color={getTypeTagColor(type)} key={type}>
              {type.toUpperCase()}
            </Tag>
          ),
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: 'Status',
        key: 'status',
        // eslint-disable-next-line react/display-name
        render: (item: any) => {
          if (item.status === 'running') {
            return <Progress percent={Math.floor(item.progress * 100)} />;
          } else {
            return (
              item.status && (
                <Tag color={getStatusTagColor(item.status)} key={item.status}>
                  {item.status.toUpperCase()}
                </Tag>
              )
            );
          }
        },
        filters: [
          {
            text: 'Failed',
            value: 'failed',
          },
          {
            text: 'Completed',
            value: 'completed',
          },
          {
            text: 'Running',
            value: 'running',
          },
          {
            text: 'Pending',
            value: 'pending',
          },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.status.indexOf(value) === 0,
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        editable: true,
        width: '24%',
        sorter: (a, b) => sortComments(a?.comment, b?.comment),
      },
      {
        title: 'Visibility',
        key: 'visibility',
        ellipsis: true,
        width: 115,
        render: (text, record) => {
          return this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.handleDelete(record.id, record.visible)}
            >
              {record?.visible ? (
                <Button type="primary">Hide</Button>
              ) : (
                <Button>Unhide</Button>
              )}
            </Popconfirm>
          ) : null;
        },
        filters: [
          {
            text: 'Hidden',
            value: 'false',
          },
          {
            text: 'Visible',
            value: 'true',
          },
        ],
        onFilter: (value, record) => record.visible?.toString() === value,
        defaultFilteredValue: ['true'],
      },
    ];
  }

  isLoading = true;

  handleDelete = (id, visible) => {
    editAnalysis(id, 'visible', !visible).then(() => {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter((item) => item.id !== id),
        initialDataSource: dataSource.filter((item) => item.id !== id),
      });
    });
  };

  search = (value) => {
    const filteredData = this.state.initialDataSource.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    this.setState({ dataSource: filteredData });
  };

  searchFamily = (value) => {
    getAnalysesByFamily(value).then((response) =>
      response.analyses.map((analysis) => {
        return {
          family: analysis.family,
          priority: analysis.priority,
          id: analysis.id,
          started: analysis.started_at,
          type: analysis.type,
          user: analysis.user?.name,
          status: analysis.status,
          comment: analysis.comment,
          visible: analysis.is_visible,
          progress: analysis.progress,
        };
      })
    );
  };

  componentDidMount() {
    // The backend is returning hidden runs even with the property is_visible=false. This is a hack to avoid display them,
    // the ones that are not visible are filtered in the table and the filter button is hidden here
    if (
      this.props.isVisible === true &&
      document.getElementsByClassName('ant-table-filter-trigger')[2]
    ) {
      document.getElementsByClassName('ant-table-filter-trigger')[2][
        'styles'
      ].display = 'none';
    }
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
      initialDataSource: newData,
    });
  };

  componentDidUpdate(props) {
    const { dataSource } = this.props;
    if (props.dataSource !== dataSource) {
      if (dataSource) {
        this.setState({ dataSource: dataSource });
      }
    }
  }

  render() {
    const dataSource = this.state ? this.state.dataSource : [];
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
        {!this.props.hideSearch && (
          <Input.Search
            hidden={this.props.hideSearch}
            style={{ margin: '0 0 10px 0' }}
            placeholder="Search..."
            enterButton
            onSearch={this.search}
          />
        )}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </div>
    );
  }
}
