import React from 'react'
import {Switch,Route} from 'react-router-dom';
import Signup from '../src/components/signup/signup'
import Login from '../src/components/login/login'
import Home from '../src/components/home/home'
import RegionPrimaryChart from '../src/components/primary/region_primary_chart';
import RegionSecondaryChart from '../src/components/secondary/region_secondary_chart';
import GenderPrimaryChart from '../src/components/primary/gender_primary_chart';
import GenderSecondaryChart from '../src/components/secondary/gender_secondary_chart';
import DistrictPrimaryChart from '../src/components/primary/district_primary_chart';
import DistrictSecondaryChart from '../src/components/secondary/district_secondary';
import Upload from '../src/components/upload/upload';
import ProtectedRoute from './protected';
const Routes=()=>{
        return(
            <Switch>
             
                <Route path="/signup" component={Signup} />
                <ProtectedRoute exact path="/" component={Home}     />
                <ProtectedRoute exact path="/home" component={Home}     />
                <ProtectedRoute exact path="/primary" component={RegionPrimaryChart} />
                <ProtectedRoute exact path="/secondary" component={RegionSecondaryChart} />
                <ProtectedRoute path="/primary/gender" component={GenderPrimaryChart} />
                <ProtectedRoute path="/secondary/gender" component={GenderSecondaryChart} />
                <ProtectedRoute path="/primary/district" component={DistrictPrimaryChart} />
                <ProtectedRoute path="/secondary/district" component={DistrictSecondaryChart} />
                <ProtectedRoute path="/upload" component={Upload} />
                <ProtectedRoute path="/login" component={Login} />
            </Switch>
        )
  
    
}
export default Routes;