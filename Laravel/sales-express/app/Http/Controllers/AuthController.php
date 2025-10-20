<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\CompanyInfo;
use Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;


class AuthController
{

    public function register_employee(Request $request,$companyid)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'lastname'=>'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:3',
        ]);
        if(!$validator->fails())
        {
            $user = User::create([
            'name' => $request->name,
            'lastname'=>$request->lastname,
            'email' => $request->email,
            'sysrole'=>1,
            'companyrole'=>4,
            'company'=>$companyid,
            'password' => Hash::make($request->password),
            ]);
            if($user==null)
            {
                return Response::json(array(
                'code' => 400,
                'message' => "Error creating user.",
            ), 400);
            }
        $token = $user->createToken('auth_token')->plainTextToken;
        return Response::json(array(
            'code'      =>  200,
            'message'   =>  "User ".$user->name." successfully registered.",
            'access_token' => $token, 
            'token_type' => 'Bearer'
        ), 200);
        }
        else
        {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }

    }

    public function register_manager(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'lastname'=>'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:3',
            'companyname'=> 'required|string',
            'companyaddress'=>'required|string',
            'companydesc'=>'required|string'
        ]);

        if(!$validator->fails())
        {

            $company = CompanyInfo::create([
                'imgpath'=>"images/logo_default.png",
                'name'=>$request->companyname,
                'address'=>$request->companyaddress,
                'description'=>$request->companydesc
            ]);
            if($company==null)
            {
                return Response::json(array(
                'code' => 400,
                'message' => "Error creating company.",
                ), 400);
            }

            $user = User::create([
            'name' => $request->name,
            'lastname'=>$request->lastname,
            'email' => $request->email,
            'sysrole'=>1,
            'companyrole'=>3,
            'company'=>$company->id,
            'password' => Hash::make($request->password),
            ]);

            if($user==null)
            {
                return Response::json(array(
                'code' => 400,
                'message' => "Error creating user.",
            ), 400);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return Response::json(array(
            'code'      =>  200,
            'message'   =>  "User ".$user->name." successfully registered.",
            'access_token' => $token, 
            'token_type' => 'Bearer'
        ), 200);
        }
        else
        {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
    }



    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return Response::json(array(
                'code' => 401,
                'message' => "Unauthorized access."
            ), 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return Response::json(array(
            'code' => 200,
            'message' => "User " . $user->name . " logged in.",
            'user_id'=>auth()->user()->id,
            'username'=>$user->name." ".$user->lastname,
            'companyrole'=>$user->companyrole,
            'sysrole'=>$user->sysrole,
            'access_token' => $token,
            'token_type' => 'Bearer',

        ), 200);
    }


    public function logoff()
    {
        auth()->user()->tokens()->delete();
        return Response::json(array(
            'code' => 200,
            'message' => "User " . auth()->user()->name . " logged off.",
        ), 200);
    }

    function resetpassword(Request $request)
    {
         $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully.'])
            : response()->json(['error' => __($status)], 422);
    }

    function makepasswordresettoken(Request $request)
    {
         $validator = Validator::make($request->all(), ['email' => 'required|email']);
        if ($validator->fails()) {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
        $token = app('auth.password.broker')->createToken(User::where('email', $request->email)->first());
        
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $mail->Port = env('MAIL_PORT', 587);
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($request->email, 'Recipient Name');
            $mail->isHTML(true);
            $mail->Subject = 'Reset your SalesExpress password';
            $mail->Body    = '
            <h1 style="font-family:Times New Roman">Sales<i style="color:lightgrey">Express</i></h1><br/>
            <p style="font-size:12pt"><b>Dear customer,</b></p>
            <p style="font-size:12pt">Please click the following link to reset your SalesExpress account password.</p><br/><br/><br/>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
            <td align="center">
            <a style="text-align:center;font-size:16pt;border:2px solid lightblue;background-color:lightblue;text-decoration:underline;" href="http://127.0.0.1:3000/newpassword?mail='.$request->email.'&token='.$token.'">Click this link to reset the password!</a>
            </td>
            </tr>
            </table>
            <br/>
            <p style="font-size:12pt">Sincerely,<br/>
            The SalesExpress team.</p>';
            $mail->AltBody = 'SalesExpress: Dear customer, please copy the following link to reset your password: http://127.0.0.1:3000/newpassword?mail='.$request->email.'&token='.$token.' Sincerely, the SalesExpress team.';
            $mail->send();
            return Response::json(array(
                'code' => 200,
                'message' => "Password reset email sent.",
            ), 200);
        } catch (Exception $e) 
        {
            return Response::json(array(
                'code' => 400,
                'message' => "Password not reset. Mailer Error: {$mail->ErrorInfo}",
            ), 400);
        }

    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'=>'required|integer',

        ]);
        if(!$validator->fails())
        {
            $user = User::find($request->user_id);
            if ($request->name != null) {
                if ($user->name != $request->name && trim($request->name) != "") {
                $user->name = $request->name;
            }
        }
        if ($request->password != null) {
            if ($user->password != Hash::make($request->password) && trim($request->password) != "") {
                $user->password = Hash::make($request->password);
            }
        }

        if ($request->email != null) {
            if ($user->email != $request->email && trim($request->email) != "") {
                $user->email = $request->email;
            }
        }

        if ($request->lastname != null) {
            if ($user->lastname != $request->lastname && trim($request->lastname) != "") {
                $user->lastname = $request->lastname;
            }
        }

        if ($request->companyrole != null) {
            if ($user->companyrole != $request->companyrole && trim($request->companyrole) != "") {
                $user->companyrole = $request->companyrole;
            }
        }
        $user->update();
        return Response::json(array(
            'code' => 200,
            'message' => "Successfully updated user",
        ), 200);
        }
        else
        {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
    }

public function updatemyprofile(Request $request)
    {
        $user = auth()->user();
        if ($request->name != null) {
            if ($user->name != $request->name && trim($request->name) != "") {
                $user->name = $request->name;
            }
        }
        if ($request->password != null) {
            if ($user->password != Hash::make($request->password) && trim($request->password) != "") {
                $user->password = Hash::make($request->password);
            }
        }

        if ($request->email != null) {
            if ($user->email != $request->email && trim($request->email) != "") {
                $user->email = $request->email;
            }
        }

        if ($request->lastname != null) {
            if ($user->lastname != $request->lastname && trim($request->lastname) != "") {
                $user->lastname = $request->lastname;
            }
        }

        if ($request->companyrole != null) {
            if ($user->companyrole != $request->companyrole && trim($request->companyrole) != "") {
                $user->companyrole = $request->companyrole;
            }
        }
        $user->update();
        return Response::json(array(
            'code' => 200,
            'message' => "Successfully updated user",
        ), 200);
    }


    public function searchuserbyname(Request $request)
    {
        $validator = Validator::make($request->all(), ['user' => 'required|string']);
        if ($validator->fails()) {
            return Response::json(array(
                'code' => 400,
                'message' => $validator->errors(),
            ), 400);
        }
        $user = $request->user;
        $users = User::where(function($query) use($user){
        $query->where('name', 'LIKE', "%".$user."%")
              ->orWhere('lastname', 'LIKE', "%".$user."%");
        })->where('company', auth()->user()->company)->get();

        if(count($users)==0)
        {
            return Response::json(array(
            'message' => "No users found",
            'code' => "404",
        ), 404);
        }
        return Response::json(array(
            'users' => $users,
            'code' => "200",
        ), 200);

    }

    public function me()
    {
         return Response::json(array('user'=>new UserResource(auth()->user()),'code'=>200),200);
    }

    public function mycompanyemployees()
    {
        return Response::json(array('users'=>new UserCollection(User::where("company",auth()->user()->company)->get()),'code'=>200),200);
    }

    public function show($user_id)
    {
        return Response::json(array('user'=>new UserResource(User::find($id)),'code'=>200),200);
    }

    public function destroy($user_id)
    {
        if(User::find($user_id)->delete())
        {
            return Response::json(array('message'=>"User deleted successfully.","code"=>200),200);
        }
        else
        {
            return Response::json(array('message'=>"Error deleting user.","code"=>400),400);
        }
    }
}
