import { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/hooks/useSettings';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const handleSave = () => {
    onUpdate({ name, email });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          Profile
        </CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="w-4 h-4" />
            Change Photo
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Display Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}
