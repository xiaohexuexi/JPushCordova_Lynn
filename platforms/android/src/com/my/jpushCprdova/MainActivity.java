/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.my.jpushCprdova;

import android.os.Bundle;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.util.Log;
import android.app.NotificationManager;
import org.apache.cordova.*;

public class MainActivity extends CordovaActivity
{
	private NotificationManager mNotificationManager;
	private static final String TAG = "JpushAndroid";
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
		Log.e(TAG, "onCreate");
		
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        
        loadUrl(launchUrl);
    }
    

	@Override
	protected void onResume() {
		Log.e(TAG, "onResume");

        mNotificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.cancelAll();
        
		super.onResume();
	}
}
