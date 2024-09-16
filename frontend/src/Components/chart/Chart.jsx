import "./chart.scss";
import moment from 'moment';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";

const Chart = ({ aspect, title, id }) => {
  var now = moment();
  //const endDate = now.format('MM-DD-YYYY')
  //const startDate = moment().date(1).month(now.month()).format('MM-DD-YYYY')
  var month6 = now.format('MMMM');
  console.log('sixth :' , month6)

  function getStartAndEndDate(month, year) {
    month = month - 1;
    year = month === -1 ? (year - 1) : year;
    const lastDate = moment().date(1).month(month).daysInMonth();
    return {
      startDate: moment().date(1).month(month).year(year).format('MM-DD-YYYY'),
      endDate: moment().date(lastDate).month(month).year(year).format('MM-DD-YYYY'),
      date: moment().date(1).month(month).year(year),
    }
  }

  const fifthMonth = getStartAndEndDate(now.month(), now.year());
  var check = moment(fifthMonth.startDate, 'MM-DD-YYYY');
  var month5 = check.format('MMMM');
  console.log('fifth :' , month5)

  const fourthMonth = getStartAndEndDate(fifthMonth.date.month(), fifthMonth.date.year());
  var check = moment(fourthMonth.startDate, 'MM-DD-YYYY');
  var month4 = check.format('MMMM');
  console.log('fourth :' , month4)


  const thirdMonth = getStartAndEndDate(fourthMonth.date.month(), fourthMonth.date.year());
  var check = moment(thirdMonth.startDate, 'MM-DD-YYYY');
  var month3 = check.format('MMMM');
  console.log('third :', month3)

  const secondMonth = getStartAndEndDate(thirdMonth.date.month(), thirdMonth.date.year());
  var check = moment(secondMonth.startDate, 'MM-DD-YYYY');
  var month2 = check.format('MMMM');
  console.log('second :',month2)

  const firstMonth = getStartAndEndDate(secondMonth.date.month(), secondMonth.date.year());
  var check = moment(firstMonth.startDate, 'MM-DD-YYYY');
  var month1 = check.format('MMMM');
  console.log('first :',month1)

  const dispatch = useDispatch()
  const {posts} = useSelector(state => state.posts)
  const {questions} = useSelector(state=>state.questions)

  function rendement(month) {
    const TotalQuestions = questions.filter(p => p.createdby._id === id && moment(p?.createdAt).format('MMMM') === month).length
    const TotalPosts = posts.filter(p => p.createdby._id === id && moment(p?.createdAt).format('MMMM') === month).length
    const Total = TotalQuestions + TotalPosts
    return Total
  }
  function rendementAll(month) {
    const TotalQuestions = questions.filter(p =>  moment(p?.createdAt).format('MMMM') === month).length
    const TotalPosts = posts.filter(p => moment(p?.createdAt).format('MMMM') === month).length
    const Total = TotalQuestions + TotalPosts
    return Total
  }
 

  const data = [
    { name: month1, Total: id ? rendement(month1) : rendementAll(month1)},
    { name: month2, Total: id ? rendement(month2) : rendementAll(month2) },
    { name: month3, Total: id ? rendement(month3) : rendementAll(month3) },
    { name: month4, Total: id ? rendement(month4) : rendementAll(month4) },
    { name: month5, Total: id ? rendement(month5) : rendementAll(month5) },
    { name: month6, Total: id ? rendement(month6) : rendementAll(month6) },
  ];


  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
