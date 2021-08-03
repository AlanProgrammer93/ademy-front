import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import TopNav from './components/TopNav';
import Register from './pages/Register';
import DashboardInstructor from './pages/instructor/DashboardInstructor';
import DashboardUser from './pages/user/DashboardUser';
import { useContext } from 'react';
import { Context } from './context';
import CourseView from './pages/instructor/CourseView';
import InstructorRevenue from './pages/instructor/InstructorRevenue';
import CourseCreate from './pages/instructor/CourseCreate';
import CourseEdit from './pages/instructor/CourseEdit';
import SingleCourse from './pages/SingleCourse';
import UserViewCourse from './pages/user/UserViewCourse';
import BecomeInstructor from './pages/user/BecomeInstructor';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <TopNav />
        <Switch>

          <PublicRoute path="/login" exact>
            <Login />
          </PublicRoute>
          <PublicRoute path="/register" exact>
            <Register />
          </PublicRoute>

          <InstructorRoute path='/instructor/course/view/:slug' exact component={CourseView} />
          <InstructorRoute path='/instructor/course/create' exact>
            <CourseCreate />
          </InstructorRoute>
          <InstructorRoute path='/instructor/course/edit/:slug' exact component={CourseEdit} />
          <InstructorRoute path='/instructor/revenue' exact>
            <InstructorRevenue />
          </InstructorRoute>
          <InstructorRoute path='/instructor'>
            <DashboardInstructor />
          </InstructorRoute>
          
          <UserRoute path='/user/become-instructor' exact>
            <BecomeInstructor />
          </UserRoute>
          <UserRoute path='/user/course/:slug' exact component={UserViewCourse} />
          <UserRoute path='/user' exact>
            <DashboardUser />
          </UserRoute>

          <Route path="/course/:slug" exact component={SingleCourse} />
          <Route path="/forgot-password" exact>
            <ForgotPassword />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

const PublicRoute = ({children, ...rest}) => {
  
  const {state} = useContext(Context);
  const { user } = state;

  return (
    <Route 
      {...rest}
      render={({location}) => {
        return !user ? (
          children
        ) : user.role[0] === 'Instructor' ? (
          <Redirect to={
            {
              pathname: '/instructor',
              state: {from: location}
            }
          } />
        ) : (
          <Redirect to={
            {
              pathname: '/user',
              state: {from: location}
            }
          } />
        );
      }}
    ></Route>
  )
}

const InstructorRoute = ({children, ...rest}) => {
  
  const {state} = useContext(Context);
  const { user } = state;
  
  return (
    <Route
      {...rest}
      render={({location}) => {
        return !user ? (
            <Redirect to={{
              pathname: '/login',
              state: {from: location}
            }} />
          ) : user && user.role[0] === 'Instructor' ? (
            children
          ) : (
            <Redirect to={{
              pathname: '/',
              state: {from: location}
            }} />
          )
      }}
    ></Route>
  )
}

const UserRoute = ({children, ...rest}) => {
  
  const {state} = useContext(Context);
  const { user } = state;

  return (
    <Route
      {...rest}
      render={({location}) => {
        return !user ? (
            <Redirect to={{
              pathname: '/login',
              state: {from: location}
            }} />
          ) : user && user.role[0] === 'Subscriber' ? (
            children
          ) : (
            <Redirect to={{
              pathname: '/',
              state: {from: location}
            }} />
          )
      }}
    ></Route>
  )
}

export default App;
