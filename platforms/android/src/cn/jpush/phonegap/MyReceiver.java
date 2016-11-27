package cn.jpush.phonegap;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cn.jpush.android.api.JPushInterface;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.NotificationManager;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningTaskInfo;
import android.content.ComponentName;

public class MyReceiver extends BroadcastReceiver {
    private static String TAG = "JPushPlugin";
    private static final List<String> IGNORED_EXTRAS_KEYS =
            Arrays.asList(
                    "cn.jpush.android.TITLE",
                    "cn.jpush.android.MESSAGE",
                    "cn.jpush.android.APPKEY",
                    "cn.jpush.android.NOTIFICATION_CONTENT_TITLE"
            );

    @Override
    public void onReceive(Context context, Intent intent) {

        getTopActivityName(context);
        
        String action = intent.getAction();
        if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(action)) {
            handlingMessageReceive(intent);
        } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(action)) {
            handlingNotificationReceive(context, intent);
        } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(action)) {
            handlingNotificationOpen(context, intent);
        } else if (JPushInterface.ACTION_RICHPUSH_CALLBACK.equals(action)) {
            
        } else {
            Log.d(TAG, "Unhandled intent - " + action);
        }
    }

    
    private void handlingMessageReceive(Intent intent) {
        String msg = intent.getStringExtra(JPushInterface.EXTRA_MESSAGE);
        Map<String, Object> extras = getNotificationExtras(intent);
        JPushPlugin.transmitMessageReceive(msg, extras);
    }

    
    private void handlingNotification(Context context, Intent intent) {
        Log.i(TAG, "----------------  handlingNotification");

        Intent launch = context.getPackageManager().getLaunchIntentForPackage(
                context.getPackageName());
        launch.addCategory(Intent.CATEGORY_LAUNCHER);
        launch.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        String title = intent.getStringExtra(JPushInterface.EXTRA_NOTIFICATION_TITLE);
        JPushPlugin.notificationTitle = title;

        String alert = intent.getStringExtra(JPushInterface.EXTRA_ALERT);
        JPushPlugin.notificationAlert = alert;

        Map<String, Object> extras = getNotificationExtras(intent);
        JPushPlugin.notificationExtras = extras;
        
        //change: transmit onReceiveNotification
        //应该是：如果list页面在前台，需要onOpenNotification；如果list不在前台，需要onReceiveNotification
        if( getTopActivityName(context).equals("com.my.jpushCprdova.MainActivity")) {
        	JPushPlugin.transmitNotificationOpen(title, alert, extras);
        }
        else {
        	JPushPlugin.transmitNotificationReceive(title, alert, extras);
        }
    }


    private void handlingNotificationReceive(Context context, Intent intent) {
    	
        Log.i(TAG, "----------------  handlingNotificationReceive");
        handlingNotification(context, intent);
    }   
    
    private void handlingNotificationOpen(Context context, Intent intent) {
        
//        String title = intent.getStringExtra(JPushInterface.EXTRA_NOTIFICATION_TITLE);
//        JPushPlugin.openNotificationTitle = title;
//
//        String alert = intent.getStringExtra(JPushInterface.EXTRA_ALERT);
//        JPushPlugin.openNotificationAlert = alert;
//
//        Map<String, Object> extras = getNotificationExtras(intent);
//        JPushPlugin.openNotificationExtras = extras;
//
//        JPushPlugin.transmitNotificationOpen(title, alert, extras);
//
//        context.startActivity(launch);
        
        Log.i(TAG, "----------------  handlingNotificationOpen");
        
        handlingNotification(context, intent);

        Intent launch = context.getPackageManager().getLaunchIntentForPackage(
            context.getPackageName());
        launch.addCategory(Intent.CATEGORY_LAUNCHER);
        launch.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        context.startActivity(launch);
    }


    private Map<String, Object> getNotificationExtras(Intent intent) {
        Map<String, Object> extrasMap = new HashMap<String, Object>();
        for (String key : intent.getExtras().keySet()) {
            if (!IGNORED_EXTRAS_KEYS.contains(key)) {
                if (key.equals(JPushInterface.EXTRA_NOTIFICATION_ID)) {
                    extrasMap.put(key, intent.getIntExtra(key, 0));
                } else {
                    extrasMap.put(key, intent.getStringExtra(key));
                }
            }
        }
        return extrasMap;
    }



    public String getTopActivityName(Context context){
    	
        String topActivityClassName=null;  
        ActivityManager activityManager = (ActivityManager)(context.getSystemService(android.content.Context.ACTIVITY_SERVICE )) ;  
        List<RunningTaskInfo> runningTaskInfos = activityManager.getRunningTasks(1) ;  
        if(runningTaskInfos != null){  
        	ComponentName f = runningTaskInfos.get(0).topActivity;  
        	topActivityClassName=f.getClassName();  
        } 
        Log.e(TAG, "getTopActivityName " + topActivityClassName);
        
        return topActivityClassName;
	}
}
