import * as React from 'react';
import useUserApplications from './useUserApplications';
import useUserOrders from './useUserOrders';
import useUserReports from './useUserReports';



const useUserHooks = () => {
    const userApplications = useUserApplications()
    const userOrders = useUserOrders()
    const userReports = useUserReports()

    
    return { userApplications,userOrders ,userReports};
}
export default useUserHooks