<?php

use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;
use BitApps\Assist\Model\Channel;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTChannelsTableMigration extends Migration
{
    public function up()
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon');
            $table->timestamp('created_at')->nullable();
        });

        $channels = [
            [
                'name'  => 'Tawk',
                'icon'  => 'https://ik.imagekit.io/shuvo/tawk_lRs2yWJrF.png?ik-sdk-version=javascript-1.4.3&updatedAt=1664616416507',
            ], [
                'name'  => 'Knowledge-Base',
                'icon'  => 'https://ik.imagekit.io/shuvo/knowledge_BSDRwrcWm.png?ik-sdk-version=javascript-1.4.3&updatedAt=1659175963039',
            ], [
                'name'  => 'FAQ',
                'icon'  => 'https://ik.imagekit.io/shuvo/faq2_ySsQ5jXdE.png?ik-sdk-version=javascript-1.4.3&updatedAt=1658749492982',
            ], [
                'name'  => 'Custom-Form',
                'icon'  => 'https://ik.imagekit.io/shuvo/google-forms_15ZYafggb.png?ik-sdk-version=javascript-1.4.3&updatedAt=1657019669212',
            ], [
                'name'  => 'Messenger',
                'icon'  => 'https://ik.imagekit.io/shuvo/messenger-01_-PT9LygZ4.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655785530211',
            ], [
                'name'  => 'Twitter',
                'icon'  => 'https://ik.imagekit.io/shuvo/twit-01_16QZC0FLY.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702008201',
            ], [
                'name'  => 'Telegram',
                'icon'  => 'https://ik.imagekit.io/shuvo/tel-01_qcAXvYA_X.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702007764',
            ], [
                'name'  => 'Instagram',
                'icon'  => 'https://ik.imagekit.io/shuvo/insta-01_ioMDLMvY_.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702005341',
            ], [
                'name'  => 'Whatsapp',
                'icon'  => 'https://ik.imagekit.io/shuvo/wapp-01_fQL4cDqCK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702009439',
            ], [
                'name'  => 'Skype',
                'icon'  => 'https://ik.imagekit.io/shuvo/skype-01_vB2TQ4YqV.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702006604',
            ], [
                'name'  => 'Discord',
                'icon'  => 'https://ik.imagekit.io/shuvo/discord-01_MIfdMcuoZD.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702004165',
            ], [
                'name'  => 'Line',
                'icon'  => 'https://ik.imagekit.io/shuvo/line-01_ofNtyZ_GH.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702005625',
            ], [
                'name'  => 'Snapchat',
                'icon'  => 'https://ik.imagekit.io/shuvo/schat-01_8-4w8SFW1.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702006361',
            ], [
                'name'  => 'Viber',
                'icon'  => 'https://ik.imagekit.io/shuvo/viber-01_qTOoeDNhtj.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702009019',
            ], [
                'name'  => 'WeChat',
                'icon'  => 'https://ik.imagekit.io/shuvo/wechat-01_mIgZwch48.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702009753',
            ], [
                'name'  => 'SMS',
                'icon'  => 'https://ik.imagekit.io/shuvo/sms-01_2yVV_Ym_f.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702007445',
            ], [
                'name'  => 'Linkedin',
                'icon'  => 'https://ik.imagekit.io/shuvo/in-01_AgaFB_8al.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702004813',
            ], [
                'name'  => 'TikTok',
                'icon'  => 'https://ik.imagekit.io/shuvo/tiktok-01_TiQggr1sv.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702007926',
            ], [
                'name'  => 'Google-Map',
                'icon'  => 'https://ik.imagekit.io/shuvo/map-01_bgY_9zdcA.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702006197',
            ], [
                'name'  => 'Slack',
                'icon'  => 'https://ik.imagekit.io/shuvo/slack-01_0W5QuxZJL3.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702007040',
            ], [
                'name'  => 'Youtube',
                'icon'  => 'https://ik.imagekit.io/shuvo/utube-01_SkaL5If1P.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702008532',
            ], [
                'name'  => 'Call',
                'icon'  => 'https://ik.imagekit.io/shuvo/call-01_M1sBOx1ii.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655702003787',
            ]];

        $existChannels = Channel::whereIn('name', array_column($channels, 'name'))->get(['name']);
        $insertAbleChannels = array_filter($channels, fn ($channel) => !in_array($channel['name'], array_column($existChannels, 'name')));

        if (count($insertAbleChannels) > 0) {
            Channel::insert($insertAbleChannels);
        }
    }

    public function down()
    {
        Schema::drop('channels');
    }
}
