/*******************************************************************************
 *                            CHANGE HISTORY                                   *
 *-----------------------------------------------------------------------------*
 *   <Date>   | <Version> | <Author>      |            <Description>           *
 *-----------------------------------------------------------------------------*
 * 2022-09-05 | 0.1       | Thomasvon     |                 create
 ******************************************************************************/

#include "blikvm_gpio.h"
#include "GPIO/armbianio.h"
#include "kvmd/blikvm_oled/blikvm_oled.h"
#include "common/blikvm_util/blikvm_util.h"
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

#define TAG "GPIO"

#ifdef  VER4
#include "st7789_oled.h"
#define SW1 12   //GPIO 257
#define SW2 35   //GPIO 258
#define SW2_LED 32   //GPIO 261 ==> act
#endif

static blikvm_int8_t SW1;
static blikvm_int8_t SW2;
static blikvm_int8_t SW2_LED;
static blikvm_board_type_e type;

#define GPIO_CYCLE  100  //ms

typedef struct 
{
    blikvm_int8_t init;
}blikvm_gpio_t;

typedef struct 
{
    blikvm_uint8_t count;
    blikvm_int8_t state; // 0:low 1:high
    blikvm_int8_t triggered; 
    blikvm_int8_t act_cycle;
    blikvm_int8_t last_act_state;
}blikvm_gpio_state_t;


blikvm_gpio_t g_gpio = {0};

static blikvm_void_t *blikvm_gpio_loop(void *_);

blikvm_int8_t blikvm_gpio_init()
{
	// Initialize the library
    blikvm_int8_t ret = -1;
    do
    {
        type = blikvm_get_board_type();
        if (type == H616_BOARD)
        {
            SW1 = 12;   //GPIO 257
            SW2 = 35;   //GPIO 258
            SW2_LED = 32;   //GPIO 261 ==> act
        }
        else if( type == CM4_V5_BOARD)
        {
            SW1 = 12;   //GPIO 3
            SW2 = 35;   //GPIO 2
            SW2_LED = 32;   //GPIO 261 ==> act
        }
        else
        {
            BLILOG_E(TAG, "Unsupported board\n");
            break;
            return ret;
        }

        const blikvm_int8_t *szBoardName;
        blikvm_int8_t rc = AIOInit();
        if (rc == 0)
        {
            BLILOG_E(TAG,"Problem initializing ArmbianIO library\n");
            break;
        }
        szBoardName = AIOGetBoardName();

        if (type == H616_BOARD)
        {
            AIOAddGPIO(SW1, GPIO_IN);
            AIOAddGPIO(SW2_LED, GPIO_OUT);
        }
        else if( type == CM4_V5_BOARD)
        {
            AIOAddGPIO(SW1, GPIO_IN);
        }

        g_gpio.init = 1;
        ret = 0;
        BLILOG_D(TAG,"Running on a %s\n", szBoardName);
    } while (0>1);

    return ret;
}

blikvm_int8_t blikvm_gpio_start()
{
    blikvm_int8_t ret = -1;
    
    do
    {
        if(g_gpio.init != 1U)
        {
            BLILOG_E(TAG,"not init\n");
            break;
        }
        if( type == H616_BOARD || type == CM4_V5_BOARD)
        {
            pthread_t blikvm_gpio_thread;
            blikvm_int8_t thread_ret = pthread_create(&blikvm_gpio_thread, NULL, blikvm_gpio_loop, NULL);
            if(thread_ret != 0)
            {
                BLILOG_E(TAG,"creat loop thread failed\n");
                break;
            }
        }
        ret = 0;
    } while (0>1);
    return ret;
}

// now only v4 have button event.

static blikvm_void_t *blikvm_gpio_loop(void *_)
{
    
    static blikvm_gpio_state_t sw1 = {0};
    static blikvm_gpio_state_t sw2 = {0};

    while (1)
    {
        if( type == H616_BOARD || type == CM4_V5_BOARD){
            if(AIOReadGPIO(SW1) == 1)
            {
                sw1.count = (sw1.count + 1) % 6;
            }
            else
            {
                sw1.count = 0;
            }
            if( sw1.count >= 5)
            {
                blikvm_oled_open_one_cycle();
                sw1.count = 0;
            }
        } 
        if( type == H616_BOARD ){
            if(sw2.act_cycle == 0 )
            {
                AIOWriteGPIO(SW2_LED, GPIO_LOW);
                sw2.last_act_state = GPIO_LOW;
            }
            else if(sw2.last_act_state != GPIO_HIGH)
            {
                AIOWriteGPIO(SW2_LED,  GPIO_HIGH);
                sw2.last_act_state = GPIO_HIGH;
            }
            sw2.act_cycle = (sw2.act_cycle+1)%20;
        }
        usleep(100*1000);
    }
    return NULL;
}